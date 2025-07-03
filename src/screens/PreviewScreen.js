// src/screens/PreviewScreen.js

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  ScrollView,
  Image
} from 'react-native';

import StringArtCanvas from '../components/StringArtCanvas';
import { generateNails } from '../core/nailGenerator';
import { generateThreadPattern, optimizeThreadPattern, calculatePatternQuality } from '../core/threadAlgorithm';
import { processImage } from '../core/imageProcessor';
import { exportToText } from '../core/exporter';
import { exportToSVG } from '../core/svgExporter';
import { saveProject, loadProject } from '../core/projectSaver';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function PreviewScreen({ route, navigation }) {
  const { imagePath, imageData, settings } = route.params || {};
  
  const [nails, setNails] = useState([]);
  const [lines, setLines] = useState([]);
  const [animatedLines, setAnimatedLines] = useState([]);
  const [edgeImage, setEdgeImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [patternQuality, setPatternQuality] = useState(0);
  const [animating, setAnimating] = useState(false);

  const canvasSize = Math.min(screenWidth - 40, screenHeight * 0.4);

  const defaultSettings = {
    nailCount: settings?.nailCount || 200,
    maxLines: settings?.maxLines || 200,
    neighborAvoidance: settings?.neighborAvoidance || 3,
  };

  const processImageAndGenerate = useCallback(async () => {
    if (!imagePath) {
      Alert.alert('Error', 'No image selected');
      return;
    }

    setLoading(true);
    setProcessingStep('Processing image...');

    try {
      // Process the image
      const processedImage = await processImage(imagePath);
      setEdgeImage(processedImage);
      setProcessingStep('Generating nails...');

      // Generate nails around the circle
      const canvasDimensions = { width: canvasSize, height: canvasSize };
      const generatedNails = generateNails(defaultSettings.nailCount, canvasDimensions);
      setNails(generatedNails);
      setProcessingStep('Generating thread pattern...');

      // Generate thread pattern using the processed image
      const generatedLines = generateThreadPattern(
        generatedNails,
        processedImage,
        defaultSettings.maxLines,
        defaultSettings.neighborAvoidance
      );

      setProcessingStep('Optimizing pattern...');
      
      // Optimize the pattern
      const optimizedLines = optimizeThreadPattern(generatedLines, processedImage, 2);
      setLines(optimizedLines);

      // Calculate quality score
      const quality = calculatePatternQuality(optimizedLines, processedImage);
      setPatternQuality(quality);

      setProcessingStep('Complete!');
      
      // Start animation
      setTimeout(() => {
        animateLines(optimizedLines);
      }, 500);

    } catch (error) {
      console.error('Error processing:', error);
      Alert.alert('Processing Error', error.message || 'Failed to generate pattern');
    } finally {
      setLoading(false);
    }
  }, [imagePath, defaultSettings, canvasSize]);

  useEffect(() => {
    if (imagePath) {
      processImageAndGenerate();
    }
  }, [processImageAndGenerate]);

  const animateLines = async (allLines) => {
    setAnimating(true);
    setAnimatedLines([]);
    
    const batchSize = 5; // Animate 5 lines at a time for better performance
    
    for (let i = 0; i < allLines.length; i += batchSize) {
      const batch = allLines.slice(0, i + batchSize);
      setAnimatedLines(batch);
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    setAnimating(false);
  };

  const handleExportTXT = async () => {
    if (!animatedLines.length) {
      Alert.alert('No Pattern', 'Generate a pattern first');
      return;
    }

    try {
      const path = await exportToText(animatedLines);
      Alert.alert("Exported", `Saved to: ${path}`);
    } catch (error) {
      Alert.alert("Export Error", error.message);
    }
  };

  const handleExportSVG = async () => {
    if (!nails.length || !animatedLines.length) {
      Alert.alert('No Pattern', 'Generate a pattern first');
      return;
    }

    try {
      const path = await exportToSVG(nails, animatedLines);
      Alert.alert("Exported", `Saved to: ${path}`);
    } catch (error) {
      Alert.alert("Export Error", error.message);
    }
  };

  const handleSaveProject = async () => {
    if (!nails.length || !lines.length) {
      Alert.alert('No Pattern', 'Generate a pattern first');
      return;
    }

    try {
      const project = {
        settings: defaultSettings,
        nails,
        lines,
        imagePath,
        patternQuality,
        timestamp: new Date().toISOString()
      };
      await saveProject(project);
      Alert.alert("Success", "Project saved successfully");
    } catch (error) {
      Alert.alert("Save Error", error.message);
    }
  };

  const handleLoadProject = async () => {
    try {
      const loaded = await loadProject();
      if (loaded) {
        setNails(loaded.nails || []);
        setLines(loaded.lines || []);
        setAnimatedLines(loaded.lines || []);
        setPatternQuality(loaded.patternQuality || 0);
        Alert.alert("Loaded", "Project restored successfully");
      } else {
        Alert.alert("Error", "No saved project found");
      }
    } catch (error) {
      Alert.alert("Load Error", error.message);
    }
  };

  const handleRegenerate = () => {
    Alert.alert(
      'Regenerate Pattern',
      'This will create a new pattern with the same settings. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Regenerate', onPress: processImageAndGenerate }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>String Art Preview</Text>
        {patternQuality > 0 && (
          <Text style={styles.quality}>
            Quality Score: {patternQuality.toFixed(1)}
          </Text>
        )}
      </View>

      {imageData && (
        <View style={styles.imagePreview}>
          <Text style={styles.sectionTitle}>Original Image</Text>
          <Image source={{ uri: imageData.uri }} style={styles.originalImage} />
        </View>
      )}

      <View style={styles.canvasContainer}>
        <Text style={styles.sectionTitle}>String Art Pattern</Text>
        
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>{processingStep}</Text>
          </View>
        )}

        <View style={[styles.canvasWrapper, { width: canvasSize, height: canvasSize }]}>
          <StringArtCanvas 
            nails={nails} 
            lines={animatedLines} 
            size={canvasSize}
          />
        </View>

        {animating && (
          <Text style={styles.animationText}>
            Animating... {animatedLines.length}/{lines.length} lines
          </Text>
        )}
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Nails</Text>
          <Text style={styles.statValue}>{nails.length}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Lines</Text>
          <Text style={styles.statValue}>{lines.length}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Max Lines</Text>
          <Text style={styles.statValue}>{defaultSettings.maxLines}</Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={[styles.button, styles.secondaryButton]} 
            onPress={() => navigation.navigate('Settings', { settings: defaultSettings })}
          >
            <Text style={styles.buttonText}>Settings</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.primaryButton]} 
            onPress={handleRegenerate}
            disabled={loading}
          >
            <Text style={[styles.buttonText, styles.primaryButtonText]}>Regenerate</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={[styles.button, styles.exportButton]} 
            onPress={handleExportTXT}
            disabled={!animatedLines.length}
          >
            <Text style={styles.buttonText}>Export TXT</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.exportButton]} 
            onPress={handleExportSVG}
            disabled={!animatedLines.length}
          >
            <Text style={styles.buttonText}>Export SVG</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={[styles.button, styles.secondaryButton]} 
            onPress={handleSaveProject}
            disabled={!lines.length}
          >
            <Text style={styles.buttonText}>Save Project</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.secondaryButton]} 
            onPress={handleLoadProject}
          >
            <Text style={styles.buttonText}>Load Project</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  quality: {
    fontSize: 16,
    color: '#007AFF',
  },
  imagePreview: {
    alignItems: 'center',
    padding: 20,
  },
  originalImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#333',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 15,
    textAlign: 'center',
  },
  canvasContainer: {
    alignItems: 'center',
    padding: 20,
  },
  canvasWrapper: {
    backgroundColor: '#000',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#333',
  },
  loadingContainer: {
    position: 'absolute',
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 20,
    borderRadius: 8,
  },
  loadingText: {
    color: 'white',
    marginTop: 10,
    fontSize: 16,
  },
  animationText: {
    color: '#888',
    marginTop: 10,
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#2a2a2a',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    color: '#888',
    fontSize: 14,
    marginBottom: 4,
  },
  statValue: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonContainer: {
    padding: 20,
    gap: 15,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  button: {
    flex: 1,
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  secondaryButton: {
    backgroundColor: '#444',
  },
  exportButton: {
    backgroundColor: '#28a745',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  primaryButtonText: {
    color: 'white',
  },
});
