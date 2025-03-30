import os
import subprocess
import threading
import uuid
import re
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Dictionary to store the status and results of background tasks
tasks = {}

def run_app_py_worker(job_id, topic):
    """Runs the app.py script in a background thread and updates task status."""
    tasks[job_id]['status'] = 'Starting...'
    video_filename = None
    process = None  # Initialize process to None

    try:
        # Command to run the python script
        # Use '-u' for unbuffered output to get status updates sooner
        command = ['python', 'app.py', f"{topic}"]
        print(f"Running command: {' '.join(command)}") # Log the command being run

        # Start the process
        process = subprocess.Popen(
            command,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            encoding='utf-8', # Adjust if your script outputs a different encoding
            errors='replace'  # Replace characters that can't be decoded
        )

        stdout_output = ""
        stderr_output = ""

        # --- Read stdout line by line for real-time status updates ---
        if process.stdout:
            for line in iter(process.stdout.readline, ''):
                stdout_output += line
                print(f"[Job {job_id} STDOUT]: {line.strip()}") # Log script output

                # --- Update status based on keywords ---
                line_lower = line.lower().strip()
                if 'script:' in line_lower:
                    tasks[job_id]['status'] = 'Generating script'
                elif 'detected language:' in line_lower:
                     tasks[job_id]['status'] = 'Transcribing audio'
                elif 'timed captions:' in line_lower:
                     tasks[job_id]['status'] = 'Generating timed captions'
                # Use a more specific pattern for keyword/text generation if possible
                elif 'text [[[' in line_lower or 'keywords:' in line_lower:
                     tasks[job_id]['status'] = 'Extracting keywords/text'
                # Check for video search/linking indicators
                elif 'pexels.com' in line_lower or 'downloading video' in line_lower or 'linking video' in line_lower:
                     tasks[job_id]['status'] = 'Finding/Linking stock videos'
                elif 'moviepy - building video' in line_lower:
                     tasks[job_id]['status'] = 'Rendering video'
                elif 'moviepy - writing audio' in line_lower:
                     tasks[job_id]['status'] = 'Writing audio track'
                elif 'moviepy - writing video' in line_lower:
                     tasks[job_id]['status'] = 'Writing video file'
                # --- Check for the final video file name ---
                # REMOVED: No longer detecting filename from stdout
                # elif line_strip.endswith('.mp4') and not video_filename: # Check only if not already found
                #     video_filename = line_strip # Assign the whole line (filename)
                #     print(f"[Job {job_id}] Found video filename: {video_filename}")
                #     # Don't mark as complete yet, wait for process to fully exit
                #     tasks[job_id]['status'] = 'Finalizing video' -> Can set this after 'Writing video file' if needed
            process.stdout.close()

        # --- Wait for the process to complete ---
        return_code = process.wait()

        # Capture any stderr output
        if process.stderr:
            stderr_output = process.stderr.read()
            process.stderr.close()
            if stderr_output.strip():
                 print(f"[Job {job_id} STDERR]: {stderr_output.strip()}")

        # --- Set final status based on exit code ---
        if return_code == 0:
             # Assume success means the video was created with the expected name
            video_filename = "rendered_video.mp4" # Hardcode the filename
            tasks[job_id]['status'] = 'complete'
            # Use the hardcoded filename for the result URL
            tasks[job_id]['result'] = f"/video/{video_filename}"
            print(f"Job {job_id} completed successfully. Assumed video: {video_filename}. URL: {tasks[job_id]['result']}")
        # REMOVED: Obsolete check for video_filename detection failure
        # elif return_code == 0 and not video_filename:
        #     tasks[job_id]['status'] = 'error'
        #     tasks[job_id]['error'] = 'Script finished successfully, but failed to detect video filename in output.'
        #     print(f"Job {job_id} finished (Code 0) but no video filename found.")
        else: # Handles return_code != 0
            tasks[job_id]['status'] = 'error'
            error_message = f"Script failed with exit code {return_code}."
            if stderr_output.strip():
                 error_message += f" Stderr: {stderr_output.strip()}"
            else:
                 # Include some stdout if stderr is empty, might contain error info
                 last_stdout_lines = "\n".join(stdout_output.strip().split('\n')[-5:]) # Last 5 lines
                 error_message += f" Last stdout lines: {last_stdout_lines}"

            tasks[job_id]['error'] = error_message
            print(f"Job {job_id} failed. Error: {error_message}")

    except FileNotFoundError:
        tasks[job_id]['status'] = 'error'
        tasks[job_id]['error'] = "Error: 'python' command not found or app.py not found in the current directory."
        print(f"Job {job_id} failed: FileNotFoundError")
    except Exception as e:
        tasks[job_id]['status'] = 'error'
        tasks[job_id]['error'] = f"An unexpected error occurred: {str(e)}"
        print(f"Job {job_id} failed: Exception: {str(e)}")
        # If the process was started, try to terminate it
        if process and process.poll() is None:
            process.terminate()
            print(f"Job {job_id} terminated due to exception.")


@app.route('/start_generation', methods=['POST'])
def start_generation():
    """Starts the video generation process."""
    data = request.get_json()
    if not data or 'topic' not in data:
        return jsonify({"error": "Missing 'topic' in request body"}), 400

    topic = data['topic']
    job_id = str(uuid.uuid4())

    # Initialize task status
    tasks[job_id] = {'status': 'pending', 'result': None, 'error': None, 'topic': topic}

    # Start the background task
    thread = threading.Thread(target=run_app_py_worker, args=(job_id, topic))
    thread.start()

    print(f"Started job {job_id} for topic: '{topic}'")
    return jsonify({"job_id": job_id})

@app.route('/status/<job_id>', methods=['GET'])
def get_status(job_id):
    """Gets the status of a video generation task."""
    task = tasks.get(job_id)
    if not task:
        return jsonify({"error": "Job ID not found"}), 404

    # Return the current status, result (if complete), or error
    response = {"job_id": job_id, "status": task['status']}
    if task['status'] == 'complete':
        response['result'] = task['result']
    elif task['status'] == 'error':
        response['error'] = task['error']

    return jsonify(response)

@app.route('/video/<path:filename>')
def serve_video(filename):
    """Serves the generated video file from a specific directory."""
    # Hardcode the absolute path to the directory containing the video
    # Use a raw string (r"...") or double backslashes (\\) for Windows paths
    video_directory = r"C:\Users\Administrator\Documents\GenerAItor\backend"
    expected_filename = "rendered_video.mp4" # Expected filename

    # Basic security check: Ensure the requested filename matches the expected one
    if filename != expected_filename:
        print(f"Error: Attempt to access unexpected file: {filename}")
        return jsonify({"error": "Invalid video file requested"}), 400

    print(f"Serving video: {filename} from {video_directory}")
    try:
        # Use the hardcoded directory
        return send_from_directory(video_directory, filename, as_attachment=False)
    except FileNotFoundError:
        print(f"Error: Video file not found at expected path: {os.path.join(video_directory, filename)}")
        return jsonify({"error": "Video file not found"}), 404


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000, debug=True) 