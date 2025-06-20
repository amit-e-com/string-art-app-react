// src/core/imageProcessor.js

export function applyEdgeDetection(imageData) {
  const width = imageData.width;
  const height = imageData.height;
  const pixels = imageData.data;

  const output = new Uint8ClampedArray(width * height);

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
          const pixelIndex = ((y + ky) * width + (x + kx)) * 4;
          const intensity = pixels[pixelIndex];

          gx += intensity * kernelX[ky + 1][kx + 1];
          gy += intensity * kernelY[ky + 1][kx + 1];
        }
      }

      const magnitude = Math.abs(gx) + Math.abs(gy);
      output[y * width + x] = Math.min(255, Math.max(0, magnitude));
    }
  }

  return {
    width,
    height,
    data: output
  };
}
