
import React, { useState, useRef } from 'react';
import { toast } from 'sonner';
import { Upload, PlayCircle, Smartphone, Monitor, Square, Captions } from 'lucide-react';
import { Textarea } from "./ui/textarea";
import { Switch } from "./ui/switch";

interface VideoInputProps {
  onVideoSubmit: (data: { 
    type: 'file', 
    source: File, 
    query: string,
    aspectRatio: '1:1' | '16:9' | '9:16',
    captions: boolean
  }) => void;
  isProcessing: boolean;
}

const VideoInput: React.FC<VideoInputProps> = ({ onVideoSubmit, isProcessing }) => {
  const [dragActive, setDragActive] = useState(false);
  const [userQuery, setUserQuery] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '16:9' | '9:16'>('16:9');
  const [enableCaptions, setEnableCaptions] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith('video/')) {
        toast.error('Please select a valid video file');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleFileSubmit = () => {
    if (!selectedFile) {
      toast.error('Please select a video file');
      return;
    }
    
    onVideoSubmit({ 
      type: 'file', 
      source: selectedFile,
      query: userQuery,
      aspectRatio,
      captions: enableCaptions
    });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (!file.type.startsWith('video/')) {
        toast.error('Please drop a valid video file');
        return;
      }
      setSelectedFile(file);
    }
  };

  // Aspect ratio visualization styles
  const aspectRatioOptionStyles = (value: '1:1' | '16:9' | '9:16') => {
    return `relative flex items-center justify-center cursor-pointer p-3 rounded-lg border transition-all
      ${aspectRatio === value 
        ? 'border-vidsmith-accent bg-vidsmith-accent/10' 
        : 'border-vidsmith-border bg-vidsmith-muted/20 hover:bg-vidsmith-muted/30'}`;
  };

  const renderAspectRatioIcon = (value: '1:1' | '16:9' | '9:16') => {
    switch (value) {
      case '1:1':
        return <Square className="w-8 h-8" />;
      case '16:9':
        return <Monitor className="w-10 h-6" />;
      case '9:16':
        return <Smartphone className="w-5 h-10" />;
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="glass-panel p-6 w-full">
        {/* User query input field */}
        <div className="space-y-2 mb-6">
          <label htmlFor="user-query" className="block text-sm text-gray-300">
            What clips would you like to generate? (optional)
          </label>
          <Textarea
            id="user-query"
            placeholder="E.g., 'Extract the most exciting moments' or 'Create clips showing product demos'"
            className="glass-input w-full min-h-[80px] text-white bg-vidsmith-muted/30 border-vidsmith-border"
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            disabled={isProcessing}
          />
        </div>

        {/* Visual Aspect Ratio Selector */}
        <div className="mb-6">
          <label className="block text-sm text-gray-300 mb-3">
            Aspect Ratio
          </label>
          <div className="grid grid-cols-3 gap-4">
            <div 
              className={aspectRatioOptionStyles('1:1')}
              onClick={() => setAspectRatio('1:1')}
            >
              {renderAspectRatioIcon('1:1')}
            </div>
            
            <div 
              className={aspectRatioOptionStyles('16:9')}
              onClick={() => setAspectRatio('16:9')}
            >
              {renderAspectRatioIcon('16:9')}
            </div>
            
            <div 
              className={aspectRatioOptionStyles('9:16')}
              onClick={() => setAspectRatio('9:16')}
            >
              {renderAspectRatioIcon('9:16')}
            </div>
          </div>
        </div>

        {/* Captions Toggle */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex items-center gap-2">
            <Captions size={16} className="text-gray-300" />
            <label className="text-sm text-gray-300">
              Generate Captions
            </label>
          </div>
          <Switch
            checked={enableCaptions}
            onCheckedChange={setEnableCaptions}
            disabled={isProcessing}
          />
        </div>

        <div className="space-y-4">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive ? 'border-vidsmith-accent bg-vidsmith-accent/10' : 'border-vidsmith-border'
            } ${isProcessing ? 'pointer-events-none opacity-60' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="video/*"
              onChange={handleFileChange}
              disabled={isProcessing}
            />
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
            <p className="text-sm text-gray-300 mb-1">
              {selectedFile ? selectedFile.name : 'Drag and drop your video here'}
            </p>
            <p className="text-xs text-gray-400">
              {selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB` : 'or click to select a file'}
            </p>
          </div>
          <button
            className="btn-primary w-full flex items-center justify-center"
            onClick={handleFileSubmit}
            disabled={!selectedFile || isProcessing}
          >
            <PlayCircle size={18} className="mr-2" />
            {isProcessing ? 'Processing...' : 'Generate Clips'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoInput;
