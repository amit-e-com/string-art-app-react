// src/core/projectSaver.js

import RNFS from 'react-native-fs';

const FILE_NAME = 'string_art_project.json';

export async function saveProject(project) {
  const path = `${RNFS.DocumentDirectoryPath}/${FILE_NAME}`;
  await RNFS.writeFile(path, JSON.stringify(project), 'utf8');
  console.log('Project saved:', path);
}

export async function loadProject() {
  const path = `${RNFS.DocumentDirectoryPath}/${FILE_NAME}`;
  try {
    const exists = await RNFS.exists(path);
    if (!exists) return null;
    const data = await RNFS.readFile(path, 'utf8');
    return JSON.parse(data);
  } catch (e) {
    console.error('Failed to load project:', e);
    return null;
  }
}
