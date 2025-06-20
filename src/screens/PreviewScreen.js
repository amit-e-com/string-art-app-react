// src/screens/PreviewScreen.js

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Button,
  Alert
} from 'react-native';

import StringArtCanvas from '../components/StringArtCanvas';
import { generateNails } from '../core/nailGenerator';
import { generateThreadPattern } from '../core/threadAlgorithm';
import { exportToText } from '../core/exporter';
import { exportToSVG } from '../core/svgExporter';
import { saveProject, loadProject } from '../core/projectSaver';

export default function PreviewScreen({ route, navigation }) {
  const { imagePath, settings } = route.params || {};
  const [nails, setNails] = useState([]);
  const [lines, setLines] = useState([]);
  const [animatedLines, setAnimatedLines] = useState([]);

  const defaultSettings = {
    nailCount: settings?.nailCount || 200,
    maxLines: settings?.maxLines || 200,
    neighborAvoidance: settings?.neighborAvoidance || 3,
  };

  useEffect(() => {
    const canvasSize = { width: 300, height: 300 };
    const generatedNails = generateNails(defaultSettings.nailCount, canvasSize);
    const generatedLines = generateThreadPattern(
      generatedNails,
      null,
      defaultSettings.maxLines,
      defaultSettings.neighborAvoidance
    );

    setNails(generatedNails);
    setLines(generatedLines);
  }, []);

  useEffect(() => {
    animateLines(lines);
  }, [lines]);

  const animateLines = async (allLines) => {
    for (let i = 1; i <= allLines.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 20));
      setAnimatedLines(allLines.slice(0, i));
    }
  };

  const handleExportTXT = async () => {
    const path = await exportToText(animatedLines);
    Alert.alert("Exported", `Saved to: ${path}`);
  };

  const handleExportSVG = async () => {
    const path = await exportToSVG(nails, animatedLines);
    Alert.alert("Exported", `Saved to: ${path}`);
  };

  const handleSaveProject = async () => {
    const project = {
      settings: defaultSettings,
      nails,
      lines
    };
    await saveProject(project);
    Alert.alert("Success", "Project saved");
  };

  const handleLoadProject = async () => {
    const loaded = await loadProject();
    if (loaded) {
      setNails(loaded.nails);
      setLines(loaded.lines);
      Alert.alert("Loaded", "Project restored");
    } else {
      Alert.alert("Error", "No saved project found");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>String Art Preview</Text>
      <StringArtCanvas nails={nails} lines={animatedLines} />

      <Button title="Export TXT" onPress={handleExportTXT} />
      <Button title="Export SVG" onPress={handleExportSVG} />
      <Button title="Save Project" onPress={handleSaveProject} />
      <Button title="Load Project" onPress={handleLoadProject} />
      <Button title="Settings" onPress={() => {
        navigation.navigate('Settings', { settings: defaultSettings });
      }} />
    </View>
  );
}
