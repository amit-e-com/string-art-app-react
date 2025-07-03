// src/core/nailGenerator.js

import Nail from '../models/Nail';

export function generateNails(count, canvasSize, pattern = 'circle', options = {}) {
  const {
    margin = 10,
    startAngle = 0,
    distribution = 'even',
    customSpacing = null
  } = options;

  switch (pattern) {
    case 'circle':
      return generateCircularNails(count, canvasSize, margin, startAngle, distribution);
    case 'square':
      return generateSquareNails(count, canvasSize, margin, distribution);
    case 'heart':
      return generateHeartNails(count, canvasSize, margin);
    case 'star':
      return generateStarNails(count, canvasSize, margin, options.points || 5);
    case 'custom':
      return generateCustomPattern(count, canvasSize, options.customPoints || []);
    default:
      return generateCircularNails(count, canvasSize, margin, startAngle, distribution);
  }
}

function generateCircularNails(count, canvasSize, margin, startAngle, distribution) {
  const nails = [];
  const centerX = canvasSize.width / 2;
  const centerY = canvasSize.height / 2;
  const radius = Math.min(centerX, centerY) - margin;

  if (distribution === 'even') {
    // Even distribution around the circle
    for (let i = 0; i < count; i++) {
      const angle = startAngle + (2 * Math.PI * i) / count;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      nails.push(new Nail(i, x, y));
    }
  } else if (distribution === 'fibonacci') {
    // Fibonacci spiral distribution
    const goldenAngle = Math.PI * (3 - Math.sqrt(5)); // Golden angle in radians
    
    for (let i = 0; i < count; i++) {
      const angle = i * goldenAngle;
      const spiralRadius = radius * Math.sqrt(i / count);
      const x = centerX + spiralRadius * Math.cos(angle);
      const y = centerY + spiralRadius * Math.sin(angle);
      
      // If outside circle, project to edge
      const distFromCenter = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
      if (distFromCenter > radius) {
        const projectionRatio = radius / distFromCenter;
        const projX = centerX + (x - centerX) * projectionRatio;
        const projY = centerY + (y - centerY) * projectionRatio;
        nails.push(new Nail(i, projX, projY));
      } else {
        nails.push(new Nail(i, x, y));
      }
    }
  } else if (distribution === 'random') {
    // Random distribution on circle perimeter
    const angles = [];
    for (let i = 0; i < count; i++) {
      angles.push(Math.random() * 2 * Math.PI);
    }
    angles.sort();
    
    angles.forEach((angle, i) => {
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      nails.push(new Nail(i, x, y));
    });
  }

  return nails;
}

function generateSquareNails(count, canvasSize, margin, distribution) {
  const nails = [];
  const width = canvasSize.width - 2 * margin;
  const height = canvasSize.height - 2 * margin;
  const perimeter = 2 * (width + height);
  
  if (distribution === 'even') {
    // Distribute evenly around square perimeter
    for (let i = 0; i < count; i++) {
      const position = (perimeter * i) / count;
      const nail = getSquarePosition(position, margin, width, height);
      nails.push(new Nail(i, nail.x, nail.y));
    }
  } else {
    // Distribute nails on each side proportionally
    const sidesNails = Math.floor(count / 4);
    const extraNails = count % 4;
    
    let nailId = 0;
    
    // Top side
    const topCount = sidesNails + (extraNails > 0 ? 1 : 0);
    for (let i = 0; i < topCount; i++) {
      const x = margin + (width * i) / (topCount - 1);
      nails.push(new Nail(nailId++, x, margin));
    }
    
    // Right side
    const rightCount = sidesNails + (extraNails > 1 ? 1 : 0);
    for (let i = 1; i < rightCount; i++) { // Start from 1 to avoid corner duplication
      const y = margin + (height * i) / (rightCount - 1);
      nails.push(new Nail(nailId++, margin + width, y));
    }
    
    // Bottom side
    const bottomCount = sidesNails + (extraNails > 2 ? 1 : 0);
    for (let i = bottomCount - 2; i >= 0; i--) { // Reverse and skip corner
      const x = margin + (width * i) / (bottomCount - 1);
      nails.push(new Nail(nailId++, x, margin + height));
    }
    
    // Left side
    const leftCount = sidesNails;
    for (let i = leftCount - 1; i > 0; i--) { // Reverse and skip corners
      const y = margin + (height * i) / (leftCount - 1);
      nails.push(new Nail(nailId++, margin, y));
    }
  }
  
  return nails;
}

function getSquarePosition(position, margin, width, height) {
  const perimeter = 2 * (width + height);
  const normalizedPos = position % perimeter;
  
  if (normalizedPos <= width) {
    // Top side
    return { x: margin + normalizedPos, y: margin };
  } else if (normalizedPos <= width + height) {
    // Right side
    return { x: margin + width, y: margin + (normalizedPos - width) };
  } else if (normalizedPos <= 2 * width + height) {
    // Bottom side
    return { x: margin + width - (normalizedPos - width - height), y: margin + height };
  } else {
    // Left side
    return { x: margin, y: margin + height - (normalizedPos - 2 * width - height) };
  }
}

function generateHeartNails(count, canvasSize, margin) {
  const nails = [];
  const centerX = canvasSize.width / 2;
  const centerY = canvasSize.height / 2;
  const scale = Math.min(centerX, centerY) - margin;
  
  for (let i = 0; i < count; i++) {
    const t = (2 * Math.PI * i) / count;
    
    // Heart equation: x = 16sin³(t), y = 13cos(t) - 5cos(2t) - 2cos(3t) - cos(4t)
    const heartX = 16 * Math.pow(Math.sin(t), 3);
    const heartY = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    
    // Scale and position
    const x = centerX + (heartX * scale) / 20;
    const y = centerY - (heartY * scale) / 20; // Negative to flip vertically
    
    nails.push(new Nail(i, x, y));
  }
  
  return nails;
}

function generateStarNails(count, canvasSize, margin, points = 5) {
  const nails = [];
  const centerX = canvasSize.width / 2;
  const centerY = canvasSize.height / 2;
  const outerRadius = Math.min(centerX, centerY) - margin;
  const innerRadius = outerRadius * 0.4; // Inner radius is 40% of outer
  
  for (let i = 0; i < count; i++) {
    const angle = (2 * Math.PI * i) / count;
    
    // Determine if we're at an outer or inner point
    const pointAngle = (2 * Math.PI) / (points * 2);
    const angleInSection = angle % pointAngle;
    const isOuter = angleInSection < pointAngle / 2;
    
    const radius = isOuter ? outerRadius : innerRadius;
    const x = centerX + radius * Math.cos(angle - Math.PI / 2); // Start from top
    const y = centerY + radius * Math.sin(angle - Math.PI / 2);
    
    nails.push(new Nail(i, x, y));
  }
  
  return nails;
}

function generateCustomPattern(count, canvasSize, customPoints) {
  const nails = [];
  
  if (customPoints.length === 0) {
    // Fallback to circle if no custom points provided
    return generateCircularNails(count, canvasSize, 10, 0, 'even');
  }
  
  // Scale custom points to fit canvas
  const maxX = Math.max(...customPoints.map(p => p.x));
  const maxY = Math.max(...customPoints.map(p => p.y));
  const minX = Math.min(...customPoints.map(p => p.x));
  const minY = Math.min(...customPoints.map(p => p.y));
  
  const scaleX = (canvasSize.width - 20) / (maxX - minX);
  const scaleY = (canvasSize.height - 20) / (maxY - minY);
  const scale = Math.min(scaleX, scaleY);
  
  const offsetX = (canvasSize.width - (maxX - minX) * scale) / 2;
  const offsetY = (canvasSize.height - (maxY - minY) * scale) / 2;
  
  for (let i = 0; i < count; i++) {
    const pointIndex = Math.floor((customPoints.length * i) / count);
    const point = customPoints[pointIndex];
    
    const x = offsetX + (point.x - minX) * scale;
    const y = offsetY + (point.y - minY) * scale;
    
    nails.push(new Nail(i, x, y));
  }
  
  return nails;
}

export function optimizeNailPlacement(nails, edgeImage) {
  if (!edgeImage || !edgeImage.data) return nails;
  
  const optimizedNails = [...nails];
  
  // Try to move nails slightly to align with edges
  optimizedNails.forEach((nail, index) => {
    let bestX = nail.x;
    let bestY = nail.y;
    let bestScore = getEdgeIntensityAt(nail.x, nail.y, edgeImage);
    
    // Check nearby positions
    for (let dx = -3; dx <= 3; dx++) {
      for (let dy = -3; dy <= 3; dy++) {
        const newX = nail.x + dx;
        const newY = nail.y + dy;
        
        // Keep within bounds
        if (newX >= 0 && newX < edgeImage.width && newY >= 0 && newY < edgeImage.height) {
          const score = getEdgeIntensityAt(newX, newY, edgeImage);
          if (score > bestScore) {
            bestScore = score;
            bestX = newX;
            bestY = newY;
          }
        }
      }
    }
    
    optimizedNails[index] = new Nail(nail.id, bestX, bestY);
  });
  
  return optimizedNails;
}

function getEdgeIntensityAt(x, y, edgeImage) {
  const pixelIndex = Math.floor(y) * edgeImage.width + Math.floor(x);
  return edgeImage.data[pixelIndex] || 0;
}

export function validateNailPlacement(nails, canvasSize, minDistance = 5) {
  const validNails = [];
  
  for (const nail of nails) {
    // Check bounds
    if (nail.x < 0 || nail.x >= canvasSize.width || 
        nail.y < 0 || nail.y >= canvasSize.height) {
      continue;
    }
    
    // Check minimum distance from other nails
    let tooClose = false;
    for (const existingNail of validNails) {
      const distance = Math.sqrt(
        Math.pow(nail.x - existingNail.x, 2) + 
        Math.pow(nail.y - existingNail.y, 2)
      );
      if (distance < minDistance) {
        tooClose = true;
        break;
      }
    }
    
    if (!tooClose) {
      validNails.push(nail);
    }
  }
  
  return validNails;
}
