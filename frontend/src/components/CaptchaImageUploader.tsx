
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, ImageIcon, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

interface CaptchaImageUploaderProps {
  onImageSelect: (file: File) => void;
  isProcessing: boolean;
  onSubmit: () => void;
}

const CaptchaImageUploader = ({
  onImageSelect,
  isProcessing,
  onSubmit,
}: CaptchaImageUploaderProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      onImageSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      onImageSelect(file);
    }
  };

  const removeImage = () => {
    setSelectedFile(null);
    setPreview(null);
  };

  return (
    <div className="space-y-5">
      <div 
        className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 ${
          isDragging 
            ? "border-purple-400 bg-purple-50" 
            : "border-gray-200 hover:border-purple-300 hover:bg-gray-50"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="image-upload"
          className="hidden"
          accept="image/*"
          onChange={handleImageChange}
        />
        <label htmlFor="image-upload" className="cursor-pointer block">
          {preview ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center"
            >
              <div className="relative w-full max-w-xs mx-auto mb-4 group">
                <img
                  src={preview}
                  alt="Captcha Preview"
                  className="w-full h-auto rounded-lg shadow-sm"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg flex items-center justify-center">
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      removeImage();
                    }}
                    className="opacity-0 group-hover:opacity-100 bg-white/90 text-red-500 p-2 rounded-full transition-opacity hover:bg-white"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-purple-600 font-medium">Click to change image</p>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center py-4">
              <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mb-4">
                <ImageIcon className="h-10 w-10 text-purple-400" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">
                  <span className="text-purple-600 font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG or GIF (max. 5MB)
                </p>
              </div>
            </div>
          )}
        </label>
      </div>

      <Button 
        type="button" 
        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md"
        disabled={!selectedFile || isProcessing}
        onClick={onSubmit}
      >
        {isProcessing ? (
          <span className="flex items-center">
            <Skeleton className="h-4 w-4 rounded-full mr-2" />
            Processing...
          </span>
        ) : (
          <span className="flex items-center">
            <Upload className="mr-2 h-4 w-4" />
            Recognize Captcha
          </span>
        )}
      </Button>
    </div>
  );
};

export default CaptchaImageUploader;
