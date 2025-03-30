import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Layout from '../components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress"; // Optional: for visual feedback
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";


const API_BASE_URL = "http://localhost:3000";

const GenerateVideo = () => {
    const [topic, setTopic] = useState<string>("");
    const [jobId, setJobId] = useState<string | null>(null);
    const [status, setStatus] = useState<string>("idle");
    const [progressMessage, setProgressMessage] = useState<string>("Enter a topic to start.");
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const intervalRef = useRef<number | null>(null);

    // Function to start the video generation
    const handleStartGeneration = async () => {
        if (!topic.trim()) {
            setError("Please enter a video topic.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setVideoUrl(null);
        setStatus('pending');
        setProgressMessage("Sending request to server...");
        setJobId(null); // Reset job ID

        try {
            const response = await fetch(`${API_BASE_URL}/start_generation`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ topic }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setJobId(data.job_id);
            setStatus('generating');
            setProgressMessage("Job started. Waiting for status updates...");
        } catch (err: any) {
            console.error("Error starting generation:", err);
            setError(err.message || "Failed to start generation process.");
            setStatus('error');
            setIsLoading(false);
        }
    };

    // Function to check the status
    const checkStatus = async (currentJobId: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/status/${currentJobId}`);
            if (!response.ok) {
                // Handle cases where the job ID might be temporarily not found
                if (response.status === 404) {
                    console.warn(`Job ${currentJobId} not found yet, retrying...`);
                    // Keep polling, maybe the server hasn't registered it yet
                    return;
                }
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            setProgressMessage(`Status: ${data.status}`); // Update progress message

            if (data.status === 'complete') {
                setStatus('complete');
                setVideoUrl(`${API_BASE_URL}${data.result}`); // Construct full URL
                setIsLoading(false);
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                }
            } else if (data.status === 'error') {
                setStatus('error');
                setError(data.error || "An unknown error occurred during generation.");
                setIsLoading(false);
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                }
            } else {
                // Keep polling if status is still pending or any other generating state
                setStatus('generating'); // Keep status as generating for intermediate steps
            }

        } catch (err: any) {
            console.error("Error checking status:", err);
            setError(err.message || "Failed to fetch status.");
            setStatus('error');
            setIsLoading(false);
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }
    };

    // Effect to poll for status when jobId is set
    useEffect(() => {
        if (jobId && status === 'generating') {
            // Clear any existing interval before starting a new one
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            // Poll immediately and then set interval
            checkStatus(jobId);
            intervalRef.current = window.setInterval(() => {
                checkStatus(jobId);
            }, 3000); // Poll every 3 seconds
        }

        // Cleanup function to clear interval when component unmounts or dependencies change
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [jobId, status]); // Rerun effect if jobId or status changes

    return (
        <Layout fullWidth>
            <div className="container mx-auto p-4 flex justify-center items-start min-h-screen">
                <Card className="w-full max-w-2xl">
                    <CardHeader>
                        <CardTitle>AI Video Generator</CardTitle>
                        <CardDescription>Enter a topic, and we'll generate a video for you.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex space-x-2">
                            <Input
                                type="text"
                                placeholder="Enter video topic (e.g., 'benefits of meditation')"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                disabled={isLoading}
                                className="flex-grow"
                            />
                            <Button onClick={handleStartGeneration} disabled={isLoading || !topic.trim()}>
                                {isLoading ? "Generating..." : "Generate Video"}
                            </Button>
                        </div>

                        {(status !== 'idle' || error) && (
                            <div className="mt-4 space-y-2">
                                <p className="text-sm font-medium">Status:</p>
                                <div className="p-3 bg-muted rounded-md text-sm">
                                    {progressMessage}
                                    {status === 'generating' && <Progress value={50} className="w-full h-2 mt-1 animate-pulse" />} {/* Simple indeterminate progress */}
                                </div>
                            </div>
                        )}

                        {error && (
                            <Alert variant="destructive" className="mt-4">
                                <Terminal className="h-4 w-4" />
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        {status === 'complete' && videoUrl && (
                            <div className="mt-6">
                                <h3 className="text-lg font-semibold mb-2">Generated Video:</h3>
                                <video controls src={videoUrl} className="w-full rounded-lg shadow-md">
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                        )}
                    </CardContent>
                    <CardFooter className="text-xs text-muted-foreground">
                        {jobId && <p>Job ID: {jobId}</p>}
                    </CardFooter>
                </Card>
            </div>
        </Layout>
    );
};

export default GenerateVideo; 