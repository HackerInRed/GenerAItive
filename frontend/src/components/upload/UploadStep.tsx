import React, { useState, useRef } from 'react';
import { Upload, Video } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner'; // Import toast from sonner

interface UploadStepProps {
  onFileSelected: (file: File) => void;
}

export const UploadStep: React.FC<UploadStepProps> = ({ onFileSelected }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (!file.type.startsWith('video/')) {
        toast.error('Please upload a valid video file');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith('video/')) {
        toast.error('Please upload a valid video file');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    try {
      await onFileSelected(selectedFile);
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Upload Your Video</h2>
        <p className="text-gray-400">Upload a video to get started. We support most video formats.</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer
          ${isDragging ? 'border-vidsmith-accent bg-vidsmith-accent/10' : 'border-vidsmith-border hover:bg-vidsmith-muted/20'}
          ${isLoading ? 'pointer-events-none opacity-60' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="video/*"
          onChange={handleFileChange}
          disabled={isLoading}
        />

        <div className="flex flex-col items-center">
          {selectedFile ? (
            <>
              <Video className="h-16 w-16 text-vidsmith-accent mb-4" />
              <p className="text-lg font-medium text-white mb-1">{selectedFile.name}</p>
              <p className="text-sm text-gray-400">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB · Click to change
              </p>
            </>
          ) : (
            <>
              <Upload className="h-16 w-16 text-gray-400 mb-4" />
              <p className="text-lg font-medium text-white mb-1">
                Drag and drop your video here
              </p>
              <p className="text-sm text-gray-400">
                or click to browse your files
              </p>
            </>
          )}
        </div>
      </motion.div>

      <div className="flex justify-center mt-6">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className={`btn-primary w-full max-w-xs py-3 flex items-center justify-center gap-2 ${!selectedFile || isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          onClick={handleSubmit}
          disabled={!selectedFile || isLoading}
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Uploading...
            </>
          ) : (
            <>
              <Upload size={18} />
              Upload Video
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
};
