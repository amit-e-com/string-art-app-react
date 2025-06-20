// src/core/exporter.js

import RNFS from 'react-native-fs';

export async function exportToText(lines) {
  const content = lines.map((line, index) =>
    `Line (${index + 1}), thread point from (${line.from.id + 1}) to (${line.to.id + 1})`
  ).join('\n');

  const path = `${RNFS.DocumentDirectoryPath}/string_art_pattern.txt`;
  await RNFS.writeFile(path, content, 'utf8');
  return path;
}
