
import React from 'react';
import { Download, Upload } from 'lucide-react';
import { Button } from "../ui/button";
import { motion } from 'framer-motion';

interface ResultStepProps {
  videoUrl: string;
  onProcessAnother: () => void;
}

export const ResultStep: React.FC<ResultStepProps> = ({ videoUrl, onProcessAnother }) => {
  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = videoUrl;
    a.download = `CreAItive_video_${new Date().getTime()}.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 text-green-400 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Video Ready!</h2>
          <p className="text-gray-400">Your AI-generated video is ready to download and share</p>
        </motion.div>
      </div>
      
      <div className="relative aspect-video overflow-hidden rounded-lg bg-black border border-vidsmith-border">
        <video 
          src={videoUrl}
          className="w-full h-full object-contain"
          controls
          autoPlay
          playsInline
        />
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button 
          onClick={handleDownload}
          className="bg-vidsmith-accent hover:bg-vidsmith-accent/90 text-white py-2 px-4 rounded-md flex items-center justify-center gap-2"
        >
          <Download size={18} />
          Download Video
        </Button>
        
        <Button 
          onClick={onProcessAnother}
          variant="outline"
          className="border-vidsmith-border text-white hover:bg-vidsmith-muted/30 py-2 px-4 rounded-md flex items-center justify-center gap-2"
        >
          <Upload size={18} />
          Process Another Video
        </Button>
      </div>
      
      <div className="text-center text-sm text-gray-500 mt-6">
        <p>Remember to save your video. Processing a new video will discard this result.</p>
      </div>
    </div>
  );
};
