import React from 'react';
import { Card } from './Card';
import { AI_MODELS } from '../constants';
import { PersonIcon } from './icons/PersonIcon';
import type { ImageInfo } from '../types';

interface ModelSelectorProps {
  onModelSelect: (imageInfo: ImageInfo) => void;
  selectedModel: ImageInfo | null;
}

const fileToImageInfo = (file: File): Promise<ImageInfo> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const parts = result.split(',');
      if (parts.length !== 2) {
        return reject(new Error("Invalid data URL format from file."));
      }
      const header = parts[0];
      const data = parts[1];
      const mimeType = header.match(/:(.*?);/)?.[1] || file.type || 'application/octet-stream';
      resolve({ url: result, base64: data, mimeType });
    };
    reader.onerror = error => reject(error);
  });

const urlToImageInfo = async (url: string): Promise<ImageInfo> => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    const blob = await response.blob();
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
        reader.onloadend = () => {
            const result = reader.result as string;
            const commaIndex = result.indexOf(',');
            if (commaIndex === -1) {
                return reject(new Error("Invalid data URL format from fetched image."));
            }
            const data = result.substring(commaIndex + 1);
            resolve({
                url: result,
                base64: data,
                mimeType: blob.type,
                sourceUrl: url,
            });
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};


export const ModelSelector: React.FC<ModelSelectorProps> = ({ onModelSelect, selectedModel }) => {

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      try {
        const file = event.target.files[0];
        const imageInfo = await fileToImageInfo(file);
        onModelSelect(imageInfo);
      } catch (error) {
        console.error("Error processing file:", error);
      }
    }
  };

  const handlePreselectedClick = async (url: string) => {
    try {
        const imageInfo = await urlToImageInfo(url);
        onModelSelect(imageInfo);
    } catch (error) {
        console.error("Error processing pre-selected image:", error);
    }
  }

  const selectedSourceUrl = selectedModel?.sourceUrl;
  const isCustomSelected = selectedModel && !selectedModel.sourceUrl;

  return (
    <Card title="1. Choose a Model" icon="person">
      <div className="grid grid-cols-3 gap-3">
        {AI_MODELS.map((model) => (
          <div
            key={model.id}
            onClick={() => handlePreselectedClick(model.url)}
            className={`
              relative aspect-[2/3] rounded-lg overflow-hidden cursor-pointer group
              transition-all duration-300 transform hover:scale-105
              ring-2 ring-offset-2 ring-offset-gray-800
              ${selectedSourceUrl === model.url ? 'ring-purple-500' : 'ring-transparent'}
            `}
          >
            <img src={model.url} alt={`AI Model ${model.id}`} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors"></div>
          </div>
        ))}

        <label className={`
          relative flex flex-col items-center justify-center aspect-[2/3] rounded-lg 
          border-2 border-dashed border-gray-600 hover:border-purple-500
          text-gray-400 hover:text-purple-400
          cursor-pointer transition-all duration-300 group overflow-hidden
          ring-2 ring-offset-2 ring-offset-gray-800
          ${isCustomSelected ? 'ring-purple-500 border-solid' : 'ring-transparent'}
        `}>
          {isCustomSelected && selectedModel ? (
             <img src={selectedModel.url} alt="Custom model" className="w-full h-full object-cover" />
          ) : (
            <div className="text-center p-2">
              <PersonIcon className="w-8 h-8 mb-2 mx-auto transition-transform group-hover:scale-110" />
              <span className="text-xs sm:text-sm font-medium">Upload Yours</span>
            </div>
          )}
          <input type="file" accept="image/*" className="sr-only" onChange={handleFileChange} />
        </label>
      </div>
    </Card>
  );
};