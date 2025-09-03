import React, { useState, useCallback } from 'react';
import { ModelSelector } from './components/ModelSelector';
import { ClothingUploader } from './components/ClothingUploader';
import { ResultViewer } from './components/ResultViewer';
import { SparklesIcon } from './components/icons/SparklesIcon';
import { runImageEditing } from './services/geminiService';
import type { ImageInfo } from './types';

const App: React.FC = () => {
  const [modelImage, setModelImage] = useState<ImageInfo | null>(null);
  const [clothingImage, setClothingImage] = useState<ImageInfo | null>(null);
  const [generatedImage, setGeneratedImage] = useState<ImageInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!modelImage || !clothingImage) {
      setError('Please select both a model and a clothing item.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const result = await runImageEditing(modelImage, clothingImage);
      if (result) {
        setGeneratedImage(result);
      } else {
        setError('The AI could not generate an image. The response may not contain image data. Please try a different image combination.');
      }
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`Failed to generate image: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [modelImage, clothingImage]);

  const isGenerateDisabled = !modelImage || !clothingImage || isLoading;

  return (
    <div className="min-h-screen font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
            AI Virtual Try-On Studio
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-lg sm:text-xl text-gray-400">
            Witness the future of fashion. Select a model, upload a piece of clothing, and let AI do the rest.
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 lg:items-start">
          <ModelSelector onModelSelect={setModelImage} selectedModel={modelImage} />
          <ClothingUploader onClothingUpload={setClothingImage} />
          <ResultViewer generatedImage={generatedImage} isLoading={isLoading} error={error} />
        </main>

        <div className="text-center mt-10 lg:mt-12">
          <button
            onClick={handleGenerate}
            disabled={isGenerateDisabled}
            className={`
              inline-flex items-center justify-center px-12 py-4 border border-transparent 
              text-lg font-semibold rounded-full shadow-lg text-white 
              bg-gradient-to-r from-purple-600 to-pink-600 
              hover:from-purple-700 hover:to-pink-700
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500
              transition-all duration-300 ease-in-out
              transform hover:scale-105
              disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:bg-gray-700 disabled:bg-none
            `}
          >
            <SparklesIcon className="w-6 h-6 mr-3" />
            {isLoading ? 'Generating...' : 'Try It On!'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;