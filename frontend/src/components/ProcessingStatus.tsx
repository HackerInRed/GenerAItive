
import React, { useEffect, useState } from 'react';
import { Cpu } from 'lucide-react';
import { Progress } from './ui/progress';

interface ProcessingStatusProps {
  progress: number;
  stage: string;
  isComplete: boolean;
}

const ProcessingStatus: React.FC<ProcessingStatusProps> = ({ progress, stage, isComplete }) => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    if (isComplete) return;
    
    const interval = setInterval(() => {
      setDots(prev => prev.length < 3 ? prev + '.' : '');
    }, 500);
    
    return () => clearInterval(interval);
  }, [isComplete]);

  // Get icon and color based on current stage
  const getStageIcon = () => {
    if (isComplete) {
      return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>;
    }
    
    if (stage.toLowerCase().includes('extract') || stage.toLowerCase().includes('audio')) {
      return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-vidsmith-accent animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 017.072 0m-9.9-2.828a9 9 0 0112.728 0" />
      </svg>;
    }
    
    if (stage.toLowerCase().includes('transcrib') || stage.toLowerCase().includes('gemini')) {
      return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>;
    }
    
    if (stage.toLowerCase().includes('caption')) {
      return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
      </svg>;
    }
    
    if (stage.toLowerCase().includes('editing') || stage.toLowerCase().includes('render')) {
      return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>;
    }
    
    return <Cpu size={20} className="text-vidsmith-accent animate-pulse" />;
  };

  return (
    <div className="glass-panel p-6 max-w-xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          {getStageIcon()}
          <h3 className="ml-2 text-lg font-medium text-white">Processing</h3>
        </div>
        <span className="text-sm text-gray-300">{Math.round(progress)}%</span>
      </div>
      
      <Progress 
        value={progress} 
        className="w-full h-2 bg-vidsmith-border rounded-full mb-4"
      />
      
      <div className="text-sm text-gray-300">
        {isComplete ? (
          <span className="text-green-400 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Processing complete
          </span>
        ) : (
          <span>
            {stage}{dots}
          </span>
        )}
      </div>
      
      {/* Processing timeline */}
      <div className="mt-6 border-t border-vidsmith-border pt-4">
        <h4 className="text-sm font-medium text-gray-400 mb-2">Processing stages:</h4>
        <ul className="space-y-2 text-xs text-gray-400">
          <li className={`flex items-center ${progress >= 10 ? 'text-green-400' : ''}`}>
            {progress >= 10 ? 
              <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg> :
              <span className="h-4 w-4 mr-2 rounded-full border border-current inline-flex"></span>
            }
            Initialization
          </li>
          <li className={`flex items-center ${progress >= 30 ? 'text-green-400' : ''}`}>
            {progress >= 30 ? 
              <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg> :
              <span className="h-4 w-4 mr-2 rounded-full border border-current inline-flex"></span>
            }
            Audio extraction & analysis
          </li>
          <li className={`flex items-center ${progress >= 60 ? 'text-green-400' : ''}`}>
            {progress >= 60 ? 
              <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg> :
              <span className="h-4 w-4 mr-2 rounded-full border border-current inline-flex"></span>
            }
            Clip identification & selection
          </li>
          <li className={`flex items-center ${progress >= 80 ? 'text-green-400' : ''}`}>
            {progress >= 80 ? 
              <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg> :
              <span className="h-4 w-4 mr-2 rounded-full border border-current inline-flex"></span>
            }
            Video editing & formatting
          </li>
          <li className={`flex items-center ${progress >= 100 ? 'text-green-400' : ''}`}>
            {progress >= 100 ? 
              <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg> :
              <span className="h-4 w-4 mr-2 rounded-full border border-current inline-flex"></span>
            }
            Finalization
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ProcessingStatus;
