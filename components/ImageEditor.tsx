import React, { useState } from 'react';
import { X, Wand2, Loader2, Save, RotateCcw } from 'lucide-react';
import { imageUrlToBase64, editProductImage } from '../services/geminiService';

interface ImageEditorProps {
  isOpen: boolean;
  onClose: () => void;
  originalImageUrl: string;
  onSave: (newImage: string) => void;
  productName: string;
}

const ImageEditor: React.FC<ImageEditorProps> = ({ isOpen, onClose, originalImageUrl, onSave, productName }) => {
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      const base64 = await imageUrlToBase64(generatedImage || originalImageUrl);
      const result = await editProductImage(base64, prompt);
      if (result) {
        setGeneratedImage(result);
      } else {
        setError("Failed to generate image. Try a different prompt.");
      }
    } catch (err) {
      setError("An error occurred while communicating with the AI service.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setGeneratedImage(null);
    setPrompt('');
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center bg-slate-50">
          <div className="flex items-center space-x-2">
            <Wand2 className="h-5 w-5 text-purple-600" />
            <h2 className="text-lg font-bold text-slate-800">AI Visualizer Studio</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full transition">
            <X className="h-6 w-6 text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Original / Source */}
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Original / Current</span>
              <div className="aspect-square rounded-xl overflow-hidden border-2 border-slate-100 bg-gray-50 relative">
                 <img 
                  src={generatedImage || originalImageUrl} 
                  alt="Source" 
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="text-sm text-slate-500 italic">Product: {productName}</p>
            </div>

            {/* Controls */}
            <div className="flex flex-col space-y-4">
              <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                <label className="block text-sm font-medium text-purple-900 mb-2">
                  What would you like to change?
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder='e.g., "Show these tiles in a luxury bathroom", "Change the steel color to red oxide"'
                  className="w-full p-3 rounded-lg border-purple-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent min-h-[100px] text-sm"
                />
                <div className="mt-3 flex justify-end">
                   <button
                    onClick={handleGenerate}
                    disabled={loading || !prompt.trim()}
                    className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium text-white transition-all ${
                      loading || !prompt.trim() 
                        ? 'bg-purple-300 cursor-not-allowed' 
                        : 'bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-200'
                    }`}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Wand2 className="h-4 w-4 mr-2" />
                        Generate Visualization
                      </>
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                  {error}
                </div>
              )}

              <div className="flex-1 bg-slate-50 rounded-xl p-4 border border-slate-100 flex flex-col justify-center items-center text-center">
                 <p className="text-sm text-slate-500 mb-2">
                   Use Gemini 2.5 Flash Image ("Nano banana") to visualize this product in different environments or finishes for your client.
                 </p>
                 {generatedImage && (
                   <button 
                    onClick={handleReset}
                    className="text-sm text-slate-600 underline hover:text-slate-900 flex items-center"
                   >
                     <RotateCcw className="h-3 w-3 mr-1" /> Reset to Original
                   </button>
                 )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-slate-50 flex justify-end space-x-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition"
          >
            Cancel
          </button>
          <button 
            onClick={() => {
              if (generatedImage) onSave(generatedImage);
              onClose();
            }}
            disabled={!generatedImage}
            className={`px-4 py-2 rounded-lg font-medium text-white transition flex items-center ${
              !generatedImage ? 'bg-slate-300 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            <Save className="h-4 w-4 mr-2" />
            Save to Invoice
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageEditor;