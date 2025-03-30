import React, { useEffect, useRef } from 'react';
import { JobStatusType } from '../../lib/types';
import { motion } from 'framer-motion';

interface ProcessingStepProps {
  jobStatus: JobStatusType;
}

export const ProcessingStep: React.FC<ProcessingStepProps> = ({ jobStatus }) => {
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (progressRef.current) {
      progressRef.current.scrollTop = progressRef.current.scrollHeight;
    }
  }, [jobStatus.message]);

  const stages = [
    { name: 'Extracting Audio', threshold: 20, icon: '🔉' },
    { name: 'Transcribing', threshold: 40, icon: '📝' },
    { name: 'Finding Highlights', threshold: 60, icon: '🔍' },
    { name: 'Editing Video', threshold: 80, icon: '✂️' },
    { name: 'Adding Captions', threshold: 90, icon: '💬' },
    { name: 'Finalizing', threshold: 100, icon: '✨' }
  ];

  const currentStage = stages.findIndex(
    (stage, index, arr) =>
      jobStatus.progress < stage.threshold ||
      index === arr.length - 1
  );

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Processing Your Video</h2>
        <p className="text-gray-400">This may take a few minutes depending on your video length</p>
      </div>

      {/* Current operation with progress circle */}
      <div className="bg-vidsmith-muted/30 p-4 rounded-md border border-vidsmith-muted flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-vidsmith-accent/20 flex items-center justify-center text-vidsmith-accent">
            <span className="text-xl">{stages[Math.max(0, currentStage)].icon}</span>
          </div>
          <div>
            <h3 className="text-white font-medium">{jobStatus.message || 'Processing...'}</h3>
            <p className="text-gray-400 text-sm">
              {jobStatus.status === 'error' ? 'An error occurred' : `Step ${currentStage + 1} of ${stages.length}`}
            </p>
          </div>
        </div>
        <div className="relative h-12 w-12">
          <svg className="h-12 w-12 transform -rotate-90" viewBox="0 0 36 36">
            <circle className="text-gray-700 stroke-current" cx="18" cy="18" r="16" strokeWidth="3" fill="none" />
            <circle
              className="text-vidsmith-accent stroke-current"
              cx="18" cy="18"
              r="16"
              strokeWidth="3"
              fill="none"
              strokeDasharray="100"
              strokeDashoffset={`${100 - jobStatus.progress}`}
              strokeLinecap="round"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-white text-sm font-medium">
            {Math.round(jobStatus.progress)}%
          </span>
        </div>
      </div>

      {/* Processing log */}
      <div
        ref={progressRef}
        className="bg-black/50 border border-vidsmith-border rounded-md p-4 h-50 overflow-y-auto text-sm font-mono"
      >
        {stages.map((stage, index) => {
          const isComplete = jobStatus.progress >= stage.threshold;
          const isCurrent = index === currentStage;

          return (
            <motion.div
              key={stage.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`mb-2 flex items-start ${isComplete ? 'text-green-400' : isCurrent ? 'text-vidsmith-accent' : 'text-gray-500'}`}
            >
              <span className="mr-2">
                {isComplete ? '✓ ' : isCurrent ? '► ' : '○ '}
              </span>
              <span>
                {stage.name}
                {isCurrent && !isComplete && (
                  <span className="animate-pulse">...</span>
                )}
              </span>
            </motion.div>
          );
        })}
      </div>

      <div className="text-center text-sm text-gray-400 italic">
        <p>Please keep this page open while we process your video</p>
      </div>
    </div>
  );
};
