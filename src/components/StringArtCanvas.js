// src/components/StringArtCanvas.js

import React from 'react';
import Svg, { Circle, Line } from 'react-native-svg';

export default function StringArtCanvas({ nails, lines }) {
  return (
    <Svg height="300" width="300" viewBox="0 0 300 300">
      {/* Draw nails */}
      {nails.map((nail) => (
        <Circle
          key={`nail-${nail.id}`}
          cx={nail.x}
          cy={nail.y}
          r={2}
          fill="red"
          opacity={0.6}
        />
      ))}

      {/* Draw thread lines */}
      {lines.map((line, index) => (
        <Line
          key={`line-${index}`}
          x1={line.from.x}
          y1={line.from.y}
          x2={line.to.x}
          y2={line.to.y}
          stroke="white"
          strokeWidth="0.5"
          opacity="0.8"
        />
      ))}
    </Svg>
  );
}
