// src/core/svgExporter.js

import RNFS from 'react-native-fs';

export async function exportToSVG(nails, lines, size = 300) {
  let content = `<?xml version="1.0" encoding="UTF-8"?>
  <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">`;

  for (let nail of nails) {
    content += `<circle cx="${nail.x}" cy="${nail.y}" r="2" fill="red" opacity="0.6"/>`;
  }

  for (let line of lines) {
    content += `<line x1="${line.from.x}" y1="${line.from.y}" x2="${line.to.x}" y2="${line.to.y}" stroke="white" stroke-width="0.5" opacity="0.8"/>`;
  }

  content += '</svg>';

  const path = `${RNFS.DocumentDirectoryPath}/string_art_pattern.svg`;
  await RNFS.writeFile(path, content, 'utf8');
  return path;
}
