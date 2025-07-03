// src/screens/SettingsScreen.js

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  Switch,
  Alert,
  Dimensions 
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

export default function SettingsScreen({ route, navigation }) {
  const { settings } = route.params || {};
  
  const [nailCount, setNailCount] = useState(settings?.nailCount || 200);
  const [maxLines, setMaxLines] = useState(settings?.maxLines || 200);
  const [neighborAvoidance, setNeighborAvoidance] = useState(settings?.neighborAvoidance || 3);
  const [threadColor, setThreadColor] = useState(settings?.threadColor || '#ffffff');
  const [showNails, setShowNails] = useState(settings?.showNails !== false);
  const [optimizePattern, setOptimizePattern] = useState(settings?.optimizePattern !== false);
  const [animationSpeed, setAnimationSpeed] = useState(settings?.animationSpeed || 50);

  const colorOptions = [
    { name: 'White', value: '#ffffff' },
    { name: 'Red', value: '#ff4444' },
    { name: 'Blue', value: '#4444ff' },
    { name: 'Green', value: '#44ff44' },
    { name: 'Yellow', value: '#ffff44' },
    { name: 'Purple', value: '#ff44ff' },
    { name: 'Orange', value: '#ff8844' },
    { name: 'Cyan', value: '#44ffff' },
  ];

  const presets = [
    { name: 'Quick', nailCount: 100, maxLines: 100, neighborAvoidance: 2 },
    { name: 'Balanced', nailCount: 200, maxLines: 200, neighborAvoidance: 3 },
    { name: 'Detailed', nailCount: 300, maxLines: 400, neighborAvoidance: 4 },
    { name: 'High Quality', nailCount: 500, maxLines: 800, neighborAvoidance: 5 },
  ];

  const applyPreset = (preset) => {
    setNailCount(preset.nailCount);
    setMaxLines(preset.maxLines);
    setNeighborAvoidance(preset.neighborAvoidance);
    Alert.alert('Preset Applied', `Applied ${preset.name} settings`);
  };

  const resetToDefaults = () => {
    Alert.alert(
      'Reset Settings',
      'Reset all settings to default values?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          onPress: () => {
            setNailCount(200);
            setMaxLines(200);
            setNeighborAvoidance(3);
            setThreadColor('#ffffff');
            setShowNails(true);
            setOptimizePattern(true);
            setAnimationSpeed(50);
          }
        }
      ]
    );
  };

  const applySettings = () => {
    const newSettings = {
      nailCount,
      maxLines,
      neighborAvoidance,
      threadColor,
      showNails,
      optimizePattern,
      animationSpeed,
    };

    navigation.navigate('Preview', {
      settings: newSettings,
      ...route.params
    });
  };

  const SliderComponent = ({ label, value, min, max, step, onValueChange, unit = '' }) => (
    <View style={styles.sliderContainer}>
      <View style={styles.sliderHeader}>
        <Text style={styles.sliderLabel}>{label}</Text>
        <Text style={styles.sliderValue}>{value}{unit}</Text>
      </View>
      <View style={styles.sliderTrack}>
        <TouchableOpacity
          style={styles.sliderButton}
          onPress={() => onValueChange(Math.max(min, value - step))}
        >
          <Text style={styles.sliderButtonText}>-</Text>
        </TouchableOpacity>
        
        <View style={styles.sliderProgress}>
          <View style={styles.sliderProgressBar}>
            <View 
              style={[
                styles.sliderProgressFill, 
                { width: `${((value - min) / (max - min)) * 100}%` }
              ]} 
            />
          </View>
        </View>
        
        <TouchableOpacity
          style={styles.sliderButton}
          onPress={() => onValueChange(Math.min(max, value + step))}
        >
          <Text style={styles.sliderButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.sliderRange}>
        <Text style={styles.rangeText}>{min}</Text>
        <Text style={styles.rangeText}>{max}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>String Art Settings</Text>
        <Text style={styles.subtitle}>Customize your pattern generation</Text>
      </View>

      {/* Quick Presets */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Presets</Text>
        <View style={styles.presetContainer}>
          {presets.map((preset) => (
            <TouchableOpacity
              key={preset.name}
              style={styles.presetButton}
              onPress={() => applyPreset(preset)}
            >
              <Text style={styles.presetButtonText}>{preset.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Pattern Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pattern Settings</Text>
        
        <SliderComponent
          label="Number of Nails"
          value={nailCount}
          min={50}
          max={1000}
          step={10}
          onValueChange={setNailCount}
        />

        <SliderComponent
          label="Maximum Lines"
          value={maxLines}
          min={50}
          max={1000}
          step={10}
          onValueChange={setMaxLines}
        />

        <SliderComponent
          label="Neighbor Avoidance"
          value={neighborAvoidance}
          min={0}
          max={10}
          step={1}
          onValueChange={setNeighborAvoidance}
        />
      </View>

      {/* Visual Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Visual Settings</Text>
        
        <View style={styles.colorSection}>
          <Text style={styles.colorLabel}>Thread Color</Text>
          <View style={styles.colorOptions}>
            {colorOptions.map((color) => (
              <TouchableOpacity
                key={color.value}
                style={[
                  styles.colorOption,
                  { backgroundColor: color.value },
                  threadColor === color.value && styles.selectedColor
                ]}
                onPress={() => setThreadColor(color.value)}
              >
                {threadColor === color.value && (
                  <Text style={styles.colorCheckmark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Show Nails</Text>
          <Switch
            value={showNails}
            onValueChange={setShowNails}
            trackColor={{ false: '#333', true: '#007AFF' }}
            thumbColor={showNails ? '#ffffff' : '#666'}
          />
        </View>

        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Optimize Pattern</Text>
          <Switch
            value={optimizePattern}
            onValueChange={setOptimizePattern}
            trackColor={{ false: '#333', true: '#007AFF' }}
            thumbColor={optimizePattern ? '#ffffff' : '#666'}
          />
        </View>

        <SliderComponent
          label="Animation Speed"
          value={animationSpeed}
          min={10}
          max={200}
          step={10}
          onValueChange={setAnimationSpeed}
          unit="ms"
        />
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.resetButton} onPress={resetToDefaults}>
          <Text style={styles.resetButtonText}>Reset to Defaults</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.applyButton} onPress={applySettings}>
          <Text style={styles.applyButtonText}>Apply Settings</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>Tips</Text>
        <Text style={styles.infoText}>• More nails = higher detail but slower processing</Text>
        <Text style={styles.infoText}>• Higher neighbor avoidance = more distributed lines</Text>
        <Text style={styles.infoText}>• Pattern optimization improves quality but takes longer</Text>
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
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  section: {
    margin: 20,
    padding: 20,
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 15,
  },
  presetContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  presetButton: {
    backgroundColor: '#444',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: (screenWidth - 80) / 2 - 5,
    alignItems: 'center',
  },
  presetButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  sliderContainer: {
    marginBottom: 20,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sliderLabel: {
    fontSize: 16,
    color: 'white',
    fontWeight: '500',
  },
  sliderValue: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  sliderTrack: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  sliderButton: {
    width: 40,
    height: 40,
    backgroundColor: '#555',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliderButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  sliderProgress: {
    flex: 1,
  },
  sliderProgressBar: {
    height: 4,
    backgroundColor: '#444',
    borderRadius: 2,
  },
  sliderProgressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 2,
  },
  sliderRange: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  rangeText: {
    fontSize: 12,
    color: '#666',
  },
  colorSection: {
    marginBottom: 20,
  },
  colorLabel: {
    fontSize: 16,
    color: 'white',
    fontWeight: '500',
    marginBottom: 10,
  },
  colorOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedColor: {
    borderColor: 'white',
  },
  colorCheckmark: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  switchLabel: {
    fontSize: 16,
    color: 'white',
    fontWeight: '500',
  },
  buttonContainer: {
    padding: 20,
    gap: 15,
  },
  resetButton: {
    backgroundColor: '#666',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  resetButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  applyButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  infoSection: {
    margin: 20,
    padding: 15,
    backgroundColor: '#333',
    borderRadius: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 5,
  },
});
