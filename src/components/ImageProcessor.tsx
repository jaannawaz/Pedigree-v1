import React, { useRef, useEffect } from 'react';
import cv from 'opencv.js';

interface ImageProcessorProps {
  imageUrl: string;
  onProcessed: (nodes: any[], connections: any[]) => void;
}

export const ImageProcessor: React.FC<ImageProcessorProps> = ({
  imageUrl,
  onProcessed,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const processImage = async () => {
      const img = new Image();
      img.src = imageUrl;
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const src = cv.imread(canvas);
        const dst = new cv.Mat();
        
        // Convert to grayscale
        cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
        
        // Apply adaptive threshold
        cv.adaptiveThreshold(
          dst,
          dst,
          255,
          cv.ADAPTIVE_THRESH_GAUSSIAN_C,
          cv.THRESH_BINARY,
          11,
          2
        );

        // Detect shapes
        const contours = new cv.MatVector();
        const hierarchy = new cv.Mat();
        cv.findContours(
          dst,
          contours,
          hierarchy,
          cv.RETR_TREE,
          cv.CHAIN_APPROX_SIMPLE
        );

        // Process detected shapes and convert to nodes/connections
        const nodes = [];
        const connections = [];
        
        // Clean up
        src.delete();
        dst.delete();
        contours.delete();
        hierarchy.delete();

        onProcessed(nodes, connections);
      };
    };

    processImage();
  }, [imageUrl]);

  return <canvas ref={canvasRef} style={{ display: 'none' }} />;
};