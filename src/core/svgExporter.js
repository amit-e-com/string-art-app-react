// src/core/svgExporter.js

import RNFS from 'react-native-fs';
import { PermissionsAndroid, Platform } from 'react-native';

async function requestStoragePermission() {
  if (Platform.OS !== 'android') return true;
  
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: 'Storage Permission',
        message: 'This app needs access to storage to save files.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      }
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    console.warn(err);
    return false;
  }
}

export async function exportToSVG(nails, lines, options = {}) {
  try {
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
      throw new Error('Storage permission required to save files');
    }

    const {
      size = 300,
      backgroundColor = '#000000',
      threadColor = '#ffffff',
      nailColor = '#ff4444',
      strokeWidth = 0.5,
      showNails = true,
      title = 'String Art Pattern',
      description = `Generated with ${lines.length} lines and ${nails.length} nails`
    } = options;

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `string_art_${timestamp}.svg`;
    
    // Create export directory if it doesn't exist
    const exportDir = `${RNFS.DownloadDirectoryPath}/StringArt`;
    const dirExists = await RNFS.exists(exportDir);
    if (!dirExists) {
      await RNFS.mkdir(exportDir);
    }
    
    const filePath = `${exportDir}/${fileName}`;
    
    // Generate SVG content
    let svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" 
     xmlns="http://www.w3.org/2000/svg">
  
  <!-- Metadata -->
  <title>${title}</title>
  <desc>${description}</desc>
  <metadata>
    <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
             xmlns:dc="http://purl.org/dc/elements/1.1/">
      <rdf:Description>
        <dc:title>${title}</dc:title>
        <dc:creator>String Art Generator App</dc:creator>
        <dc:date>${new Date().toISOString()}</dc:date>
        <dc:description>${description}</dc:description>
      </rdf:Description>
    </rdf:RDF>
  </metadata>

  <!-- Definitions -->
  <defs>
    <radialGradient id="backgroundGradient" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:#1a1a1a;stop-opacity:1" />
      <stop offset="100%" style="stop-color:${backgroundColor};stop-opacity:1" />
    </radialGradient>
    
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="0.5" result="coloredBlur"/>
      <feMerge> 
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- Background circle -->
  <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - 10}" 
          fill="url(#backgroundGradient)" 
          stroke="#333333" 
          stroke-width="2"/>

  <!-- Thread lines -->
  <g id="threads" stroke="${threadColor}" stroke-width="${strokeWidth}" 
     stroke-linecap="round" fill="none" opacity="0.8">
`;

    // Add thread lines
    lines.forEach((line, index) => {
      svgContent += `    <line x1="${line.from.x.toFixed(2)}" y1="${line.from.y.toFixed(2)}" ` +
                   `x2="${line.to.x.toFixed(2)}" y2="${line.to.y.toFixed(2)}" ` +
                   `id="line-${index}"/>\n`;
    });

    svgContent += `  </g>\n`;

    // Add nails if requested
    if (showNails) {
      svgContent += `
  <!-- Nails -->
  <g id="nails" fill="${nailColor}" stroke="#ffffff" stroke-width="0.3" opacity="0.8">
`;
      nails.forEach((nail) => {
        svgContent += `    <circle cx="${nail.x.toFixed(2)}" cy="${nail.y.toFixed(2)}" ` +
                     `r="1.5" id="nail-${nail.id}"/>\n`;
      });
      svgContent += `  </g>\n`;
    }

    svgContent += `</svg>`;

    await RNFS.writeFile(filePath, svgContent, 'utf8');
    return filePath;
    
  } catch (error) {
    console.error('SVG export error:', error);
    throw new Error(`Failed to export SVG file: ${error.message}`);
  }
}

export async function exportAnimatedSVG(nails, lines, options = {}) {
  try {
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
      throw new Error('Storage permission required to save files');
    }

    const {
      size = 300,
      backgroundColor = '#000000',
      threadColor = '#ffffff',
      nailColor = '#ff4444',
      strokeWidth = 0.5,
      showNails = true,
      animationDuration = 10, // seconds
      title = 'Animated String Art Pattern'
    } = options;

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `animated_string_art_${timestamp}.svg`;
    
    const exportDir = `${RNFS.DownloadDirectoryPath}/StringArt`;
    const dirExists = await RNFS.exists(exportDir);
    if (!dirExists) {
      await RNFS.mkdir(exportDir);
    }
    
    const filePath = `${exportDir}/${fileName}`;
    
    const lineDelay = animationDuration / lines.length;
    
    let svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" 
     xmlns="http://www.w3.org/2000/svg">
  
  <title>${title}</title>
  
  <defs>
    <radialGradient id="backgroundGradient" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:#1a1a1a;stop-opacity:1" />
      <stop offset="100%" style="stop-color:${backgroundColor};stop-opacity:1" />
    </radialGradient>
  </defs>

  <!-- Background -->
  <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - 10}" 
          fill="url(#backgroundGradient)" 
          stroke="#333333" 
          stroke-width="2"/>

  <!-- Animated thread lines -->
  <g id="threads">
`;

    // Add animated thread lines
    lines.forEach((line, index) => {
      const startTime = index * lineDelay;
      svgContent += `    <line x1="${line.from.x.toFixed(2)}" y1="${line.from.y.toFixed(2)}" ` +
                   `x2="${line.to.x.toFixed(2)}" y2="${line.to.y.toFixed(2)}" ` +
                   `stroke="${threadColor}" stroke-width="${strokeWidth}" ` +
                   `stroke-linecap="round" opacity="0">\n`;
      svgContent += `      <animate attributeName="opacity" ` +
                   `values="0;0.8" dur="0.1s" begin="${startTime.toFixed(2)}s" fill="freeze"/>\n`;
      svgContent += `    </line>\n`;
    });

    svgContent += `  </g>\n`;

    // Add nails
    if (showNails) {
      svgContent += `
  <!-- Nails -->
  <g id="nails" fill="${nailColor}" stroke="#ffffff" stroke-width="0.3" opacity="0.8">
`;
      nails.forEach((nail) => {
        svgContent += `    <circle cx="${nail.x.toFixed(2)}" cy="${nail.y.toFixed(2)}" ` +
                     `r="1.5" id="nail-${nail.id}"/>\n`;
      });
      svgContent += `  </g>\n`;
    }

    // Add replay button
    svgContent += `
  <!-- Replay button -->
  <g id="replayButton" transform="translate(10, 10)">
    <rect width="30" height="20" fill="#007AFF" rx="3" opacity="0.8"/>
    <text x="15" y="14" fill="white" text-anchor="middle" font-size="10" font-family="Arial">⟲</text>
    <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite"/>
  </g>
`;

    svgContent += `</svg>`;

    await RNFS.writeFile(filePath, svgContent, 'utf8');
    return filePath;
    
  } catch (error) {
    console.error('Animated SVG export error:', error);
    throw new Error(`Failed to export animated SVG: ${error.message}`);
  }
}

export async function exportSVGForLaserCutting(nails, lines, options = {}) {
  try {
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
      throw new Error('Storage permission required to save files');
    }

    const {
      size = 300,
      nailDiameter = 2,
      boardThickness = 6,
      units = 'mm'
    } = options;

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `string_art_laser_template_${timestamp}.svg`;
    
    const exportDir = `${RNFS.DownloadDirectoryPath}/StringArt`;
    const dirExists = await RNFS.exists(exportDir);
    if (!dirExists) {
      await RNFS.mkdir(exportDir);
    }
    
    const filePath = `${exportDir}/${fileName}`;
    
    let svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}${units}" height="${size}${units}" viewBox="0 0 ${size} ${size}" 
     xmlns="http://www.w3.org/2000/svg">
  
  <title>String Art Laser Cutting Template</title>
  <desc>Template for laser cutting string art board with nail holes</desc>
  
  <!-- Instructions -->
  <text x="10" y="20" font-family="Arial" font-size="8" fill="#666">
    Laser cutting template - ${nails.length} nail holes, diameter ${nailDiameter}${units}
  </text>
  
  <!-- Outer circle for cutting -->
  <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - 10}" 
          fill="none" stroke="#ff0000" stroke-width="0.1"/>
  
  <!-- Nail holes for drilling/cutting -->
  <g id="nailHoles" fill="none" stroke="#0000ff" stroke-width="0.1">
`;

    // Add nail holes
    nails.forEach((nail) => {
      svgContent += `    <circle cx="${nail.x.toFixed(2)}" cy="${nail.y.toFixed(2)}" ` +
                   `r="${nailDiameter / 2}" id="hole-${nail.id}"/>\n`;
    });

    svgContent += `  </g>
  
  <!-- Cut lines legend -->
  <g id="legend" transform="translate(10, ${size - 40})">
    <text y="0" font-family="Arial" font-size="6" fill="#000">Legend:</text>
    <line x1="0" y1="8" x2="15" y2="8" stroke="#ff0000" stroke-width="0.5"/>
    <text x="18" y="12" font-family="Arial" font-size="5" fill="#000">Cut line</text>
    <circle cx="7" cy="20" r="2" fill="none" stroke="#0000ff" stroke-width="0.5"/>
    <text x="18" y="24" font-family="Arial" font-size="5" fill="#000">Drill hole (${nailDiameter}${units})</text>
  </g>
  
</svg>`;

    await RNFS.writeFile(filePath, svgContent, 'utf8');
    return filePath;
    
  } catch (error) {
    console.error('Laser cutting SVG export error:', error);
    throw new Error(`Failed to export laser cutting template: ${error.message}`);
  }
}
