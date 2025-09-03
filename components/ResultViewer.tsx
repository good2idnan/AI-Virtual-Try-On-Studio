import React from 'react';
import { Card } from './Card';
import { Spinner } from './Spinner';
import { SparklesIcon } from './icons/SparklesIcon';
import type { ImageInfo } from '../types';

interface ResultViewerProps {
  generatedImage: ImageInfo | null;
  isLoading: boolean;
  error: string | null;
}

export const ResultViewer: React.FC<ResultViewerProps> = ({ generatedImage, isLoading, error }) => {
  return (
    <Card title="3. View Result" icon="sparkles">
      <div className="w-full aspect-[2/3] flex items-center justify-center rounded-lg bg-gray-900/50 overflow-hidden">
        {isLoading && <Spinner />}
        {!isLoading && error && (
          <div className="text-center text-red-400 p-4">
            <p className="font-semibold">Generation Failed</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}
        {!isLoading && !error && generatedImage && (
          <img src={generatedImage.url} alt="Generated try-on" className="w-full h-full object-cover" />
        )}
        {!isLoading && !error && !generatedImage && (
          <div className="text-center text-gray-500 p-4">
            <SparklesIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="font-semibold text-gray-400">Your virtual try-on will appear here</p>
            <p className="text-sm mt-1">Click "Try It On!" to begin.</p>
          </div>
        )}
      </div>
    </Card>
  );
};