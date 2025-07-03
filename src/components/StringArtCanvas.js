// src/components/StringArtCanvas.js

import React, { useMemo } from 'react';
import Svg, { Circle, Line, Defs, RadialGradient, Stop } from 'react-native-svg';

export default function StringArtCanvas({ nails, lines, size = 300, showNails = true, threadColor = '#ffffff', nailColor = '#ff4444' }) {
  const viewBox = `0 0 ${size} ${size}`;

  // Memoize rendered lines for performance
  const renderedLines = useMemo(() => {
    return lines.map((line, index) => (
      <Line
        key={`line-${index}`}
        x1={line.from.x}
        y1={line.from.y}
        x2={line.to.x}
        y2={line.to.y}
        stroke={threadColor}
        strokeWidth={0.5}
        opacity={0.8}
        strokeLinecap="round"
      />
    ));
  }, [lines, threadColor]);

  // Memoize rendered nails for performance
  const renderedNails = useMemo(() => {
    if (!showNails) return null;
    
    return nails.map((nail) => (
      <Circle
        key={`nail-${nail.id}`}
        cx={nail.x}
        cy={nail.y}
        r={1.5}
        fill={nailColor}
        opacity={0.8}
        stroke="#ffffff"
        strokeWidth={0.3}
      />
    ));
  }, [nails, showNails, nailColor]);

  return (
    <Svg 
      height={size} 
      width={size} 
      viewBox={viewBox}
      style={{ backgroundColor: '#000000' }}
    >
      <Defs>
        <RadialGradient id="bgGradient" cx="50%" cy="50%" rx="50%" ry="50%">
          <Stop offset="0%" stopColor="#1a1a1a" stopOpacity="1" />
          <Stop offset="100%" stopColor="#000000" stopOpacity="1" />
        </RadialGradient>
      </Defs>

      {/* Background circle */}
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={size / 2 - 10}
        fill="url(#bgGradient)"
        stroke="#333333"
        strokeWidth={2}
      />

      {/* Render thread lines */}
      {renderedLines}

      {/* Render nails on top */}
      {renderedNails}
    </Svg>
  );
}
