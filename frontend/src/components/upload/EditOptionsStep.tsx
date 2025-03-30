
import React, { useState } from 'react';
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import { Sparkles, Monitor, Smartphone, Square, Captions } from 'lucide-react';
import { VideoOptions, AspectRatioType } from './UploadProcessor';
import { motion } from 'framer-motion';

interface EditOptionsStepProps {
  initialOptions: VideoOptions;
  onSubmit: (options: VideoOptions) => void;
  isApiAvailable: boolean;
}

export const EditOptionsStep: React.FC<EditOptionsStepProps> = ({ initialOptions, onSubmit, isApiAvailable }) => {
  const [query, setQuery] = useState(initialOptions.query);
  const [aspectRatio, setAspectRatio] = useState<AspectRatioType>(initialOptions.aspectRatio);
  const [burnCaptions, setBurnCaptions] = useState(initialOptions.burnCaptions);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await onSubmit({
        query,
        aspectRatio,
        burnCaptions
      });
    } catch (error) {
      console.error('Error submitting options:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Aspect ratio option rendering
  const aspectRatioOptionStyles = (value: AspectRatioType) => {
    return `relative flex items-center justify-center cursor-pointer p-6 rounded-lg border transition-all
      ${aspectRatio === value
        ? 'border-vidsmith-accent bg-vidsmith-accent/10'
        : 'border-vidsmith-border bg-vidsmith-muted/20 hover:bg-vidsmith-muted/30'}`;
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Edit Options</h2>
        <p className="text-gray-400">Customize how your video will be processed</p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="space-y-6"
      >
        {/* AI Query Input */}
        <div className="space-y-2">
          <label htmlFor="query" className="block text-sm font-medium text-gray-300 flex items-center">
            Video Query
          </label>
          <Textarea
            id="query"
            placeholder="Describe what kind of video you want & Our AI will analyze your video and extract clips based on this query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="glass-input resize-none min-h-[60px]"
            disabled={!isApiAvailable}
          />
        </div>

        {/* Aspect Ratio Selector */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-300">
            Aspect Ratio
          </label>
          <div className="grid grid-cols-3 gap-4">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={aspectRatioOptionStyles('16:9')}
              onClick={() => setAspectRatio('16:9')}
            >
              <Monitor className="w-10 h-6 pr-2" />16:9
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={aspectRatioOptionStyles('1:1')}
              onClick={() => setAspectRatio('1:1')}
            >
              <Square className="w-8 h-8 pr-2" />1:1
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={aspectRatioOptionStyles('9:16')}
              onClick={() => setAspectRatio('9:16')}
            >
              <Smartphone className="w-8 h-10 pr-2" />9:16
            </motion.div>
          </div>
        </div>

        {/* Captions Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Captions size={16} className="text-vidsmith-accent" />
            <label className="text-sm font-medium text-gray-300">
              AI Captions
            </label>
          </div>
          <Switch
            checked={burnCaptions}
            onCheckedChange={setBurnCaptions}
            disabled={!isApiAvailable}
          />
        </div>
      </motion.div>

      <div className="flex justify-center mt-8">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className={`btn-primary w-full max-w-xs py-3 flex items-center justify-center ${isLoading || !isApiAvailable ? 'opacity-70 cursor-not-allowed' : ''}`}
          onClick={handleSubmit}
          disabled={isLoading || !isApiAvailable}
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Processing...
            </>
          ) : (
            'Start Processing'
          )}
        </motion.button>
      </div>
    </div>
  );
};
