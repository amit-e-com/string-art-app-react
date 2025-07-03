// src/core/imageProcessor.js

import RNFS from 'react-native-fs';

export async function loadImageData(imagePath) {
  try {
    // For React Native, we'll simulate image data loading
    // In a real implementation, you'd use react-native-image-resizer or similar
    console.log('Loading image from:', imagePath);
    
    // Simulate processed image data with consistent dimensions
    const width = 300;
    const height = 300;
    
    // This is a placeholder - in production you'd use proper image loading
    // For now, create a mock grayscale image data structure
    const data = new Uint8ClampedArray(width * height);
    
    // Create a basic pattern for testing (you'd replace this with actual image data)
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = y * width + x;
        // Create a simple test pattern
        data[idx] = Math.random() * 255;
      }
    }
    
    return {
      width,
      height,
      data
    };
  } catch (error) {
    console.error('Error loading image:', error);
    throw new Error('Failed to load image data');
  }
}

export function preprocessImage(imageData) {
  const { width, height, data } = imageData;
  const processed = new Uint8ClampedArray(width * height);
  
  // Apply Gaussian blur for noise reduction
  return applyGaussianBlur(data, width, height);
}

function applyGaussianBlur(data, width, height, radius = 1) {
  const kernel = [
    [1, 2, 1],
    [2, 4, 2],
    [1, 2, 1]
  ];
  const kernelSum = 16;
  
  const blurred = new Uint8ClampedArray(width * height);
  
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      let sum = 0;
      
      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          const pixelValue = data[(y + ky) * width + (x + kx)];
          sum += pixelValue * kernel[ky + 1][kx + 1];
        }
      }
      
      blurred[y * width + x] = sum / kernelSum;
    }
  }
  
  return blurred;
}

export function applyEdgeDetection(imageData, threshold = 100) {
  const width = imageData.width;
  const height = imageData.height;
  const pixels = imageData.data || imageData;

  const output = new Uint8ClampedArray(width * height);

  // Sobel edge detection kernels
  const kernelX = [
    [-1, 0, 1],
    [-2, 0, 2],
    [-1, 0, 1]
  ];

  const kernelY = [
    [-1, -2, -1],
    [0, 0, 0],
    [1, 2, 1]
  ];

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      let gx = 0, gy = 0;

      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          const pixelIndex = (y + ky) * width + (x + kx);
          const intensity = Array.isArray(pixels) ? pixels[pixelIndex] : pixels[pixelIndex];

          gx += intensity * kernelX[ky + 1][kx + 1];
          gy += intensity * kernelY[ky + 1][kx + 1];
        }
      }

      const magnitude = Math.sqrt(gx * gx + gy * gy);
      output[y * width + x] = magnitude > threshold ? 255 : 0;
    }
  }

  return {
    width,
    height,
    data: output
  };
}

export function enhanceEdges(edgeData, iterations = 2) {
  let enhanced = new Uint8ClampedArray(edgeData.data);
  const { width, height } = edgeData;
  
  for (let iter = 0; iter < iterations; iter++) {
    const temp = new Uint8ClampedArray(width * height);
    
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = y * width + x;
        
        if (enhanced[idx] > 0) {
          // Strengthen existing edges
          let neighbors = 0;
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              if (enhanced[(y + dy) * width + (x + dx)] > 0) neighbors++;
            }
          }
          temp[idx] = neighbors > 3 ? 255 : enhanced[idx];
        }
      }
    }
    enhanced = temp;
  }
  
  return {
    width,
    height,
    data: enhanced
  };
}

export async function processImage(imagePath) {
  try {
    // Load and preprocess image
    const rawImageData = await loadImageData(imagePath);
    const preprocessed = preprocessImage(rawImageData);
    
    // Apply edge detection
    const edgeData = applyEdgeDetection({ 
      width: rawImageData.width, 
      height: rawImageData.height, 
      data: preprocessed 
    });
    
    // Enhance edges for better string art generation
    const enhanced = enhanceEdges(edgeData);
    
    return enhanced;
  } catch (error) {
    console.error('Error processing image:', error);
    throw error;
  }
}
