// src/components/StringArtCanvas.js

import React from 'react';
import { View } from 'react-native';
import Canvas from 'react-native-canvas';

export default function StringArtCanvas({ nails, lines }) {
  const handleCanvas = (canvas) => {
    if (canvas) {
      const ctx = canvas.getContext('2d');
      canvas.width = 300;
      canvas.height = 300;

      ctx.fillStyle = 'red';
      nails.forEach(nail => {
        ctx.beginPath();
        ctx.arc(nail.x, nail.y, 2, 0, 2 * Math.PI);
        ctx.fill();
      });

      ctx.strokeStyle = 'white';
      ctx.lineWidth = 0.5;
      lines.forEach(line => {
        ctx.beginPath();
        ctx.moveTo(line.from.x, line.from.y);
        ctx.lineTo(line.to.x, line.to.y);
        ctx.stroke();
      });
    }
  };

  return (
    <View style={{ width: 300, height: 300 }}>
      <Canvas ref={handleCanvas} />
    </View>
  );
}
