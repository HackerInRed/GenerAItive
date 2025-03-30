
import React, { useState, useEffect } from 'react';
import { UploadStep } from './UploadStep';
import { EditOptionsStep } from './EditOptionsStep';
import { ProcessingStep } from './ProcessingStep';
import { ResultStep } from './ResultStep';
import { toast } from 'sonner';
import { JobStatusType } from '../../lib/types';
import { useApiStatus } from '../../hooks/useApiStatus';

export type UploadStepType = 'upload' | 'options' | 'processing' | 'result';
export type AspectRatioType = '16:9' | '1:1' | '9:16';

export interface VideoOptions {
  query: string;
  aspectRatio: AspectRatioType;
  burnCaptions: boolean;
}

export const UploadProcessor = () => {
  const [currentStep, setCurrentStep] = useState<UploadStepType>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [options, setOptions] = useState<VideoOptions>({
    query: '',
    aspectRatio: '16:9',
    burnCaptions: true
  });
  const [jobStatus, setJobStatus] = useState<JobStatusType>({
    status: 'idle',
    progress: 0,
    message: 'Ready to process'
  });
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const { isApiAvailable, checkApiStatus } = useApiStatus();

  // Check if the API is available on component mount
  useEffect(() => {
    checkApiStatus();
  }, [checkApiStatus]);

  const handleFileUpload = async (selectedFile: File) => {
    setFile(selectedFile);

    if (!isApiAvailable) {
      toast.error('Backend API is not available. Please check your connection.');
      return;
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

      // Create form data for file upload only
      const formData = new FormData();
      formData.append('video', selectedFile);

      // Upload the file without starting processing
      const response = await fetch(`${apiUrl}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const result = await response.json();
      if (!result.job_id) {
        throw new Error('No job ID returned from server');
      }

      setJobId(result.job_id);
      toast.success('Video uploaded successfully');

      // Move to options step
      setCurrentStep('options');
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleSubmitOptions = async (videoOptions: VideoOptions) => {
    setOptions(videoOptions);

    if (!jobId) {
      toast.error('Job ID is missing. Please upload a file first.');
      return;
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

      // Send processing options to the separate process endpoint
      const processingData = {
        query: videoOptions.query,
        aspectRatio: videoOptions.aspectRatio, // The backend will map this
        captions: videoOptions.burnCaptions
      };

      // Start processing with options
      const response = await fetch(`${apiUrl}/process/${jobId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(processingData),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      setCurrentStep('processing');
      setJobStatus({
        ...jobStatus,
        status: 'processing',
        progress: 5,
        message: 'Processing started'
      });

      // Start polling for job status
      startPolling(jobId);
    } catch (error) {
      console.error('Error starting processing:', error);
      toast.error(`Processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const startPolling = (currentJobId: string) => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`${apiUrl}/status/${currentJobId}`);

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();

        // Map the backend response to our JobStatusType
        const updatedStatus: JobStatusType = {
          ...jobStatus,
          status: data.status === 'Completed' ? 'complete' :
                  data.status.startsWith('Failed') ? 'error' : 'processing',
          progress: calculateProgress(data.status),
          message: data.status,
          error: data.status.startsWith('Failed') ? data.status.substring(8) : undefined // Extract error message
        };

        setJobStatus(updatedStatus);

        if (data.status === 'Completed') {
          setOutputUrl(`${apiUrl}/output/${currentJobId}`);
          setCurrentStep('result');
          clearInterval(pollInterval);
          toast.success('Video processing complete!');
        } else if (data.status.startsWith('Failed')) {
          toast.error(`Processing error: ${data.status}`);
          clearInterval(pollInterval);
        }
      } catch (error) {
        console.error('Error polling job status:', error);
        // Don't stop polling on network errors
      }
    }, 2000);
  };

  const resetProcess = () => {
    setFile(null);
    setJobId(null);
    setJobStatus({
      status: 'idle',
      progress: 0,
      message: 'Ready to process'
    });
    setOutputUrl(null);
    setCurrentStep('upload');
  };

  return (
    <section className="w-full py-6 md:py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {!isApiAvailable && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-white">
              <p className="font-medium flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                Backend API is not available. Some features may be limited.
              </p>
            </div>
          )}

          <div className="mb-8">
            <div className="flex items-center">
              {/* Step 1 - Upload */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center
                    ${currentStep === 'upload'
                      ? 'bg-vidsmith-accent text-white'
                      : (currentStep === 'options' || currentStep === 'processing' || currentStep === 'result')
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-700 text-gray-400'
                    }`}
                >
                  {(currentStep === 'options' || currentStep === 'processing' || currentStep === 'result') ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  ) : (
                    "1"
                  )}
                </div>
                <span className={`text-xs mt-2 ${currentStep === 'upload' ? 'text-white' : 'text-gray-400'}`}>
                  Upload
                </span>
              </div>

              {/* Line 1-2 */}
              <div
                className={`flex-1 h-0.5 mb-5 mx-2 ${
                  currentStep === 'options' || currentStep === 'processing' || currentStep === 'result'
                    ? 'bg-green-500'
                    : 'bg-gray-700'
                }`}
              ></div>

              {/* Step 2 - Options */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center
                    ${currentStep === 'options'
                      ? 'bg-vidsmith-accent text-white'
                      : (currentStep === 'processing' || currentStep === 'result')
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-700 text-gray-400'
                    }`}
                >
                  {(currentStep === 'processing' || currentStep === 'result') ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  ) : (
                    "2"
                  )}
                </div>
                <span className={`text-xs mt-2 ${currentStep === 'options' ? 'text-white' : 'text-gray-400'}`}>
                  Options
                </span>
              </div>

              {/* Line 2-3 */}
              <div
                className={`flex-1 h-0.5 mb-5 mx-2 ${
                  currentStep === 'processing' || currentStep === 'result'
                    ? 'bg-green-500'
                    : 'bg-gray-700'
                }`}
              ></div>

              {/* Step 3 - Processing */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center
                    ${currentStep === 'processing'
                      ? 'bg-vidsmith-accent text-white'
                      : currentStep === 'result'
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-700 text-gray-400'
                    }`}
                >
                  {currentStep === 'result' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  ) : (
                    "3"
                  )}
                </div>
                <span className={`text-xs mt-2 ${currentStep === 'processing' ? 'text-white' : 'text-gray-400'}`}>
                  Process
                </span>
              </div>

              {/* Line 3-4 */}
              <div
                className={`flex-1 h-0.5 mb-5 mx-2 ${
                  currentStep === 'result'
                    ? 'bg-green-500'
                    : 'bg-gray-700'
                }`}
              ></div>

              {/* Step 4 - Result */}
              <div className="flex flex-col items-center mx-0.5">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center
                    ${currentStep === 'result'
                      ? 'bg-vidsmith-accent text-white'
                      : 'bg-gray-700 text-gray-400'
                    }`}
                >
                  4
                </div>
                <span className={`text-xs mt-2 ${currentStep === 'result' ? 'text-white' : 'text-gray-400'}`}>
                  Result
                </span>
              </div>
            </div>
          </div>

          {/* Content based on current step */}
          <div className="glass-panel p-6 rounded-lg">
            {currentStep === 'upload' && (
              <UploadStep onFileSelected={handleFileUpload} />
            )}

            {currentStep === 'options' && (
              <EditOptionsStep
                initialOptions={options}
                onSubmit={handleSubmitOptions}
                isApiAvailable={isApiAvailable}
              />
            )}

            {currentStep === 'processing' && (
              <ProcessingStep jobStatus={jobStatus} />
            )}

            {currentStep === 'result' && outputUrl && (
              <ResultStep
                videoUrl={outputUrl}
                onProcessAnother={resetProcess}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

// Helper function to calculate progress based on status message
const calculateProgress = (status: string): number => {
  if (status === 'Uploaded') return 10;
  if (status === 'Extracting audio') return 20;
  if (status === 'Transcribing audio') return 40;
  if (status === 'Finding relevant segments') return 60;
  if (status === 'Editing video') return 70;
  if (status === 'Adding captions') return 90;
  if (status === 'Completed') return 100;
  if (status.startsWith('Failed')) return 0;

  // Default progress
  return 50;
};
