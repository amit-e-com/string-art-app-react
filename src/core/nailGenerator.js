// src/core/nailGenerator.js

import Nail from '../models/Nail';
import { clamp } from '../utils/mathUtils';

export function generateNails(count, canvasSize) {
  const centerX = canvasSize.width / 2;
  const centerY = canvasSize.height / 2;
  const radius = clamp(Math.min(centerX, centerY) * 0.9, 100, 500);

  const nails = [];
  for (let i = 0; i < count; i++) {
    const angle = (2 * Math.PI * i) / count;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    nails.push(new Nail(i, x, y));
  }

  return nails;
}
