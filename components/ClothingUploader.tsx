import React, { useState } from 'react';
import { Card } from './Card';
import { ShirtIcon } from './icons/ShirtIcon';
import type { ImageInfo } from '../types';

interface ClothingUploaderProps {
  onClothingUpload: (imageInfo: ImageInfo) => void;
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

export const ClothingUploader: React.FC<ClothingUploaderProps> = ({ onClothingUpload }) => {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      try {
        const file = event.target.files[0];
        const imageInfo = await fileToImageInfo(file);
        setPreview(imageInfo.url);
        onClothingUpload(imageInfo);
      } catch (error) {
        console.error("Error processing clothing file:", error);
      }
    }
  };

  return (
    <Card title="2. Upload Clothing" icon="shirt">
      <div className="w-full h-full flex flex-col">
        <label className="relative flex flex-col items-center justify-center w-full aspect-[4/3] rounded-lg border-2 border-dashed border-gray-600 hover:border-pink-500 text-gray-400 hover:text-pink-400 cursor-pointer transition-all duration-300 overflow-hidden bg-gray-900/50">
          {preview ? (
            <img src={preview} alt="Clothing preview" className="absolute inset-0 w-full h-full object-contain p-2" />
          ) : (
            <div className="text-center">
              <ShirtIcon className="w-12 h-12 mx-auto mb-3" />
              <p className="font-semibold text-gray-300">Click to upload</p>
              <p className="text-xs text-gray-500">PNG, JPG, WEBP, etc.</p>
            </div>
          )}
          <input type="file" accept="image/*" className="sr-only" onChange={handleFileChange} />
        </label>
        <div className="mt-4 text-sm text-gray-400">
            <p><strong>Tip:</strong> For best results, use an image of the clothing item on a plain background.</p>
        </div>
      </div>
    </Card>
  );
};