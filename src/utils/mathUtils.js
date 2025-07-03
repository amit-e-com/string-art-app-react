// src/utils/mathUtils.js

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function lerp(start, end, factor) {
  return start + (end - start) * factor;
}

export function distance(point1, point2) {
  return Math.sqrt(
    Math.pow(point2.x - point1.x, 2) + 
    Math.pow(point2.y - point1.y, 2)
  );
}

export function normalize(value, min, max) {
  return (value - min) / (max - min);
}

export function degToRad(degrees) {
  return degrees * (Math.PI / 180);
}

export function radToDeg(radians) {
  return radians * (180 / Math.PI);
}

export function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  const angleInRadians = degToRad(angleInDegrees - 90);
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians)
  };
}

export function cartesianToPolar(centerX, centerY, x, y) {
  const dx = x - centerX;
  const dy = y - centerY;
  const radius = Math.sqrt(dx * dx + dy * dy);
  const angle = radToDeg(Math.atan2(dy, dx)) + 90;
  return { radius, angle: angle < 0 ? angle + 360 : angle };
}

export function smoothstep(edge0, edge1, x) {
  const t = clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);
  return t * t * (3.0 - 2.0 * t);
}

export function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}

export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function mapRange(value, inMin, inMax, outMin, outMax) {
  return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}
