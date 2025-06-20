// src/screens/SettingsScreen.js

import React, { useState } from 'react';
import { View, Text, Slider, Button } from 'react-native';

export default function SettingsScreen({ route, navigation }) {
  const { settings } = route.params || {};
  const [nailCount, setNailCount] = useState(settings?.nailCount || 200);
  const [maxLines, setMaxLines] = useState(settings?.maxLines || 200);
  const [neighborAvoidance, setNeighborAvoidance] = useState(settings?.neighborAvoidance || 3);

  const applySettings = () => {
    navigation.navigate('Preview', {
      settings: {
        nailCount,
        maxLines,
        neighborAvoidance
      },
    });
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Nail Count: {nailCount}</Text>
      <Slider minimumValue={50} maximumValue={1000} step={10} value={nailCount} onValueChange={setNailCount} />

      <Text>Max Lines: {maxLines}</Text>
      <Slider minimumValue={50} maximumValue={1000} step={10} value={maxLines} onValueChange={setMaxLines} />

      <Text>Neighbor Avoidance: {neighborAvoidance}</Text>
      <Slider minimumValue={0} maximumValue={10} step={1} value={neighborAvoidance} onValueChange={setNeighborAvoidance} />

      <Button title="Apply" onPress={applySettings} />
    </View>
  );
  }
