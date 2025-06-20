// src/core/threadAlgorithm.js

import Line from '../models/Line';

export function calculateLineScore(from, to, edgeImage) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.sqrt(dx * dx + dy * dy);

  if (length < 5) return 0;

  // Simulate score based on random intensity
  const steps = Math.min(length, 20);
  let score = 0;

  for (let t = 0; t < steps; t++) {
    const x = from.x + dx * t / steps;
    const y = from.y + dy * t / steps;
    score += Math.random() * 255;
  }

  return score / steps;
}

export function generateThreadPattern(nails, edgeImage, maxLines = 200, neighborAvoidance = 3) {
  let lines = [];
  let usedConnections = new Set();
  let currentNailIndex = 0;

  for (let i = 0; i < maxLines; i++) {
    let bestScore = -1;
    let bestNailIndex = -1;

    for (let j = 0; j < nails.length; j++) {
      if (j === currentNailIndex || Math.abs(j - currentNailIndex) <= neighborAvoidance) continue;

      const key = `${Math.min(currentNailIndex, j)}-${Math.max(currentNailIndex, j)}`;
      if (usedConnections.has(key)) continue;

      const score = calculateLineScore(nails[currentNailIndex], nails[j]);
      if (score > bestScore) {
        bestScore = score;
        bestNailIndex = j;
      }
    }

    if (bestNailIndex === -1) break;

    lines.push(new Line(nails[currentNailIndex], nails[bestNailIndex]));
    usedConnections.add(`${Math.min(currentNailIndex, bestNailIndex)}-${Math.max(currentNailIndex, bestNailIndex)}`);
    currentNailIndex = bestNailIndex;
  }

  return lines;
}
