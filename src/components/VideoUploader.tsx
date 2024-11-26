import React, { useState, useRef } from 'react';
import { Video, Upload, X, Play, Pause } from 'lucide-react';
import toast from 'react-hot-toast';

type VideoUploaderProps = {
  onVideoUpload: (file: File) => void;
  maxSize?: number; // in MB
  className?: string;
};

export function VideoUploader({ 
  onVideoUpload, 
  maxSize = 100,
  className = '' 
}: VideoUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateVideo = (file: File): boolean => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      toast.error(`Video must be smaller than ${maxSize}MB`);
      return false;
    }

    // Check file type
    if (!file.type.startsWith('video/')) {
      toast.error('Please upload a valid video file');
      return false;
    }

    return true;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file && validateVideo(file)) {
      handleVideoUpload(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validateVideo(file)) {
      handleVideoUpload(file);
    }
  };

  const handleVideoUpload = async (file: File) => {
    try {
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setVideoPreview(previewUrl);

      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setUploadProgress(i);
      }

      onVideoUpload(file);
      toast.success('Video uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload video');
      setVideoPreview(null);
      setUploadProgress(0);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const removeVideo = () => {
    setVideoPreview(null);
    setUploadProgress(0);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className={`relative ${className}`}>
      {!videoPreview ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragActive 
              ? 'border-red-600 bg-red-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="video/*"
            onChange={handleChange}
            className="hidden"
          />
          <div className="flex flex-col items-center">
            <Video className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600 mb-2">
              Drag and drop your video here or{' '}
              <button
                onClick={() => inputRef.current?.click()}
                className="text-red-600 hover:text-red-700 font-medium"
              >
                browse
              </button>
            </p>
            <p className="text-sm text-gray-500">
              MP4, WebM or Ogg (max. {maxSize}MB)
            </p>
          </div>
        </div>
      ) : (
        <div className="relative rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            src={videoPreview}
            className="w-full rounded-lg"
            onEnded={() => setIsPlaying(false)}
          />
          
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <button
              onClick={togglePlay}
              className="p-3 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
            >
              {isPlaying ? (
                <Pause className="h-6 w-6 text-gray-900" />
              ) : (
                <Play className="h-6 w-6 text-gray-900" />
              )}
            </button>
          </div>

          <button
            onClick={removeVideo}
            className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>

          {uploadProgress < 100 && (
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-sm p-2">
              <div className="flex items-center gap-2">
                <Upload className="h-4 w-4 animate-bounce" />
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <span>{uploadProgress}%</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}