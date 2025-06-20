// src/screens/HomeScreen.js

import React, { useState } from 'react';
import { View, Text, Button, Image } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PreviewScreen from './PreviewScreen';

const Stack = createNativeStackNavigator();

export default function HomeScreen() {
  const [image, setImage] = useState(null);

  const pickImage = () => {
    launchImageLibrary({}, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else {
        setImage(response.assets[0].uri);
      }
    });
  };

  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator>
        <Stack.Screen name="Home">
          {() => (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text>String Art Generator</Text>
              {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
              <Button title="Select Image" onPress={pickImage} />
              <Button title="Generate Pattern" onPress={() => {
                // Navigate to PreviewScreen with imagePath
              }} />
            </View>
          )}
        </Stack.Screen>
        <Stack.Screen name="Preview" component={PreviewScreen} initialParams={{ imagePath: image }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
  }
