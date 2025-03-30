import React, { useState, useEffect } from 'react';
import VideoInput from './VideoInput';
import ProcessingStatus from './ProcessingStatus';
import VideoPlayer from './VideoPlayer';
import { toast } from 'sonner';
import { useApiStatus } from '../hooks/useApiStatus';

interface VideoSource {
  type: 'file';
  source: File;
  query: string;
  aspectRatio: '1:1' | '16:9' | '9:16';
  captions: boolean;
}

const VideoProcessor: React.FC = () => {
  const [videoSource, setVideoSource] = useState<VideoSource | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processingStage, setProcessingStage] = useState('Initializing');
  const [processedVideoUrl, setProcessedVideoUrl] = useState<string | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const { isApiAvailable, checkApiStatus } = useApiStatus();

  // Check API availability on component mount
  useEffect(() => {
    checkApiStatus();
    const intervalId = setInterval(checkApiStatus, 10000); // Check every 10 seconds
    return () => clearInterval(intervalId);
  }, [checkApiStatus]);

  // Poll for job status if we have a job ID
  useEffect(() => {
    if (!jobId || !isProcessing) return;

    const interval = setInterval(async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/status/${jobId}`);

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();

        let calculatedProgress = 0;
        if (data.status === 'Uploaded') calculatedProgress = 10;
        else if (data.status === 'Extracting audio') calculatedProgress = 20;
        else if (data.status === 'Transcribing audio') calculatedProgress = 40;
        else if (data.status === 'Finding relevant segments') calculatedProgress = 60;
        else if (data.status === 'Editing video') calculatedProgress = 70;
        else if (data.status === 'Adding captions') calculatedProgress = 90;
        else if (data.status === 'Completed') calculatedProgress = 100;

        setProgress(calculatedProgress);
        setProcessingStage(data.status || 'Processing...');

        if (data.status === 'Completed') {
          setIsProcessing(false);
          const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
          setProcessedVideoUrl(`${apiUrl}/output/${jobId}`);
          toast.success('Video processing complete!');
          clearInterval(interval);
        } else if (data.status.startsWith('Failed')) {
          setIsProcessing(false);
          toast.error(`Processing failed: ${data.status || 'Unknown error'}`);
          clearInterval(interval);
        }
      } catch (error) {
        console.error('Error polling job status:', error);
        // Don't stop polling on network errors
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [jobId, isProcessing]);

  const handleVideoSubmit = async (data: VideoSource) => {
    setVideoSource(data);
    setIsProcessing(true);
    setProgress(0);
    setProcessingStage('Initializing');
    setProcessedVideoUrl(null);

    if (isApiAvailable) {
      await processWithBackend(data);
    } else {
      simulateProcessing(data);
    }
  };

  const processWithBackend = async (data: VideoSource) => {
    try {
      toast.info('Starting video processing...');

      const formData = new FormData();
      formData.append('query', data.query || 'Extract interesting moments');

      let aspectRatioValue = 'youtube';
      if (data.aspectRatio === '1:1') aspectRatioValue = 'square';
      else if (data.aspectRatio === '9:16') aspectRatioValue = 'reel';

      formData.append('aspectRatio', aspectRatioValue);
      formData.append('burnCaptions', String(data.captions));

      if (data.type === 'file') {
        formData.append('video', data.source as File);
      }

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      setJobId(result.job_id);
      setProcessingStage('Processing started');
      setProgress(10);
    } catch (error) {
      console.error('Error processing video with backend:', error);
      setIsProcessing(false);
      toast.error(`Failed to process video: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const simulateProcessing = (data: VideoSource) => {
    toast.info('Starting video processing (simulation mode)...');
    console.log('Processing with options:', {
      aspectRatio: data.aspectRatio,
      captions: data.captions
    });

    const processingStages = [
      'Initializing',
      'Analyzing video content',
      'Identifying key moments',
      'Generating clips',
      'Applying optimizations',
      'Finalizing output'
    ];

    let currentProgress = 0;
    let currentStageIndex = 0;

    const progressInterval = setInterval(() => {
      const increment = Math.random() * 2 + 0.1;
      currentProgress += increment;

      if (currentProgress > (currentStageIndex + 1) * (100 / processingStages.length)) {
        currentStageIndex = Math.min(currentStageIndex + 1, processingStages.length - 1);
        setProcessingStage(processingStages[currentStageIndex]);
      }

      if (currentProgress >= 100) {
        clearInterval(progressInterval);

        setTimeout(() => {
          setProcessedVideoUrl('/sample-output.mp4');
          setIsProcessing(false);
          setProgress(100);
          toast.success('Video processing complete! (simulation)');
        }, 1000);

        return;
      }

      setProgress(currentProgress);
    }, 200);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {isApiAvailable && (
        <div className="text-center mb-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
            <span className="w-2 h-2 mr-2 rounded-full bg-green-400 animate-pulse"></span>
            Connected to backend
          </span>
        </div>
      )}

      {!isProcessing && !processedVideoUrl && (
        <VideoInput onVideoSubmit={handleVideoSubmit} isProcessing={isProcessing} />
      )}

      {isProcessing && (
        <ProcessingStatus
          progress={progress}
          stage={processingStage}
          isComplete={!isProcessing && processedVideoUrl !== null}
        />
      )}

      {processedVideoUrl && (
        <div className="space-y-6">
          <VideoPlayer src={processedVideoUrl} title="Your Processed Video" />

          <div className="flex justify-center">
            <button
              className="btn-secondary"
              onClick={() => {
                setVideoSource(null);
                setProcessedVideoUrl(null);
                setIsProcessing(false);
                setJobId(null);
              }}
            >
              Process another video
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoProcessor;
