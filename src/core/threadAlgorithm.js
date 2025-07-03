// src/core/threadAlgorithm.js

import Line from '../models/Line';

export function calculateLineScore(from, to, edgeImage) {
  if (!edgeImage || !edgeImage.data) {
    return Math.random() * 100; // Fallback for development
  }

  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.sqrt(dx * dx + dy * dy);

  if (length < 5) return 0;

  const steps = Math.max(Math.floor(length), 10);
  let score = 0;
  let validPixels = 0;

  // Sample points along the line
  for (let t = 0; t < steps; t++) {
    const progress = t / (steps - 1);
    const x = Math.floor(from.x + dx * progress);
    const y = Math.floor(from.y + dy * progress);

    // Check bounds
    if (x >= 0 && x < edgeImage.width && y >= 0 && y < edgeImage.height) {
      const pixelIndex = y * edgeImage.width + x;
      const intensity = edgeImage.data[pixelIndex];
      score += intensity;
      validPixels++;
    }
  }

  // Return average intensity along the line
  return validPixels > 0 ? score / validPixels : 0;
}

export function getLineIntensity(from, to, edgeImage) {
  return calculateLineScore(from, to, edgeImage);
}

export function findBestConnection(currentNailIndex, nails, edgeImage, usedConnections, neighborAvoidance = 3, usedNails = new Set()) {
  let bestScore = -1;
  let bestNailIndex = -1;
  
  for (let j = 0; j < nails.length; j++) {
    // Skip if same nail, too close, or connection already used
    if (j === currentNailIndex || 
        Math.abs(j - currentNailIndex) <= neighborAvoidance ||
        Math.abs(j - currentNailIndex) >= (nails.length - neighborAvoidance)) {
      continue;
    }

    const key = `${Math.min(currentNailIndex, j)}-${Math.max(currentNailIndex, j)}`;
    if (usedConnections.has(key)) continue;

    // Penalize frequently used nails
    const nailUsageBonus = usedNails.has(j) ? 0.7 : 1.0;
    
    const score = calculateLineScore(nails[currentNailIndex], nails[j], edgeImage) * nailUsageBonus;
    
    if (score > bestScore) {
      bestScore = score;
      bestNailIndex = j;
    }
  }

  return { nailIndex: bestNailIndex, score: bestScore };
}

export function generateThreadPattern(nails, edgeImage, maxLines = 200, neighborAvoidance = 3) {
  let lines = [];
  let usedConnections = new Set();
  let usedNails = new Map(); // Track nail usage frequency
  let currentNailIndex = 0;

  console.log('Generating thread pattern with', nails.length, 'nails and max', maxLines, 'lines');

  for (let i = 0; i < maxLines; i++) {
    const { nailIndex: bestNailIndex, score: bestScore } = findBestConnection(
      currentNailIndex, 
      nails, 
      edgeImage, 
      usedConnections, 
      neighborAvoidance,
      new Set(Array.from(usedNails.keys()))
    );

    if (bestNailIndex === -1 || bestScore < 10) {
      console.log(`Stopping at line ${i}: no good connections found`);
      break;
    }

    // Create the line
    const line = new Line(nails[currentNailIndex], nails[bestNailIndex]);
    lines.push(line);

    // Mark connection as used
    const connectionKey = `${Math.min(currentNailIndex, bestNailIndex)}-${Math.max(currentNailIndex, bestNailIndex)}`;
    usedConnections.add(connectionKey);

    // Update nail usage
    usedNails.set(currentNailIndex, (usedNails.get(currentNailIndex) || 0) + 1);
    usedNails.set(bestNailIndex, (usedNails.get(bestNailIndex) || 0) + 1);

    // Move to next nail
    currentNailIndex = bestNailIndex;

    // Progress logging
    if (i % 50 === 0) {
      console.log(`Generated ${i} lines, current score: ${bestScore.toFixed(2)}`);
    }
  }

  console.log(`Generated ${lines.length} total lines`);
  return lines;
}

export function optimizeThreadPattern(lines, edgeImage, iterations = 3) {
  if (!edgeImage || !edgeImage.data) return lines;

  let optimizedLines = [...lines];
  
  for (let iter = 0; iter < iterations; iter++) {
    console.log(`Optimization iteration ${iter + 1}/${iterations}`);
    
    // Try to improve each line
    for (let i = 0; i < optimizedLines.length; i++) {
      const line = optimizedLines[i];
      const currentScore = calculateLineScore(line.from, line.to, edgeImage);
      
      // Try small adjustments to the line endpoints
      const improvements = [];
      
      for (let dx = -2; dx <= 2; dx++) {
        for (let dy = -2; dy <= 2; dy++) {
          if (dx === 0 && dy === 0) continue;
          
          const newTo = {
            x: Math.max(0, Math.min(edgeImage.width - 1, line.to.x + dx)),
            y: Math.max(0, Math.min(edgeImage.height - 1, line.to.y + dy)),
            id: line.to.id
          };
          
          const newScore = calculateLineScore(line.from, newTo, edgeImage);
          if (newScore > currentScore) {
            improvements.push({ to: newTo, score: newScore });
          }
        }
      }
      
      // Apply best improvement
      if (improvements.length > 0) {
        const best = improvements.reduce((a, b) => a.score > b.score ? a : b);
        optimizedLines[i] = new Line(line.from, best.to);
      }
    }
  }
  
  return optimizedLines;
}

export function calculatePatternQuality(lines, edgeImage) {
  if (!lines.length || !edgeImage || !edgeImage.data) return 0;
  
  let totalScore = 0;
  let totalLength = 0;
  
  for (const line of lines) {
    const score = calculateLineScore(line.from, line.to, edgeImage);
    const length = Math.sqrt(
      Math.pow(line.to.x - line.from.x, 2) + 
      Math.pow(line.to.y - line.from.y, 2)
    );
    
    totalScore += score * length;
    totalLength += length;
  }
  
  return totalLength > 0 ? totalScore / totalLength : 0;
}
