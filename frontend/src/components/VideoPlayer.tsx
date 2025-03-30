
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, Download, Volume2, VolumeX } from 'lucide-react';

interface VideoPlayerProps {
  src: string;
  title?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, title = 'Generated Clip' }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateProgress = () => {
      setProgress((video.currentTime / video.duration) * 100);
      setCurrentTime(video.currentTime);
    };

    const handleDurationChange = () => {
      setDuration(video.duration);
      setIsLoaded(true);
    };

    const handleVideoEnd = () => {
      setIsPlaying(false);
      setProgress(100);
    };

    video.addEventListener('timeupdate', updateProgress);
    video.addEventListener('durationchange', handleDurationChange);
    video.addEventListener('ended', handleVideoEnd);
    video.addEventListener('canplay', () => setIsLoaded(true));

    return () => {
      video.removeEventListener('timeupdate', updateProgress);
      video.removeEventListener('durationchange', handleDurationChange);
      video.removeEventListener('ended', handleVideoEnd);
      video.removeEventListener('canplay', () => setIsLoaded(true));
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const restartVideo = () => {
    const video = videoRef.current;
    if (!video) return;
    
    video.currentTime = 0;
    if (!isPlaying) {
      video.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    
    video.muted = !video.muted;
    setIsMuted(!isMuted);
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    
    const newTime = (parseInt(e.target.value) / 100) * duration;
    video.currentTime = newTime;
    setProgress(parseInt(e.target.value));
    setCurrentTime(newTime);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = src;
    a.download = `${title.replace(/\s+/g, '_').toLowerCase()}.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="glass-panel overflow-hidden animate-fade-in">
      <div className="relative aspect-video bg-black">
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-vidsmith-accent border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <video 
          ref={videoRef}
          src={src}
          className={`w-full h-full object-contain ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          playsInline
        />
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-medium text-white mb-4">{title}</h3>
        
        <div className="space-y-3">
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleProgressChange}
            className="w-full h-1 bg-vidsmith-muted accent-vidsmith-accent rounded-lg appearance-none cursor-pointer"
          />
          
          <div className="flex justify-between text-xs text-gray-400">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={restartVideo}
                className="text-gray-300 hover:text-white transition-colors"
              >
                <SkipBack size={20} />
              </button>
              
              <button
                onClick={togglePlay}
                className="w-10 h-10 bg-vidsmith-accent rounded-full flex items-center justify-center text-white hover:bg-vidsmith-accent-light transition-colors"
              >
                {isPlaying ? (
                  <Pause size={20} />
                ) : (
                  <Play size={20} className="ml-1" />
                )}
              </button>
              
              <button
                onClick={toggleMute}
                className="text-gray-300 hover:text-white transition-colors"
              >
                {isMuted ? (
                  <VolumeX size={20} />
                ) : (
                  <Volume2 size={20} />
                )}
              </button>
            </div>
            
            <button
              onClick={handleDownload}
              className="flex items-center text-sm text-gray-300 hover:text-white transition-colors"
            >
              <Download size={18} className="mr-1" />
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
