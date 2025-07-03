// src/core/exporter.js

import RNFS from 'react-native-fs';
import { Alert, PermissionsAndroid, Platform } from 'react-native';

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

export async function exportToText(lines, settings = {}) {
  try {
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
      throw new Error('Storage permission required to save files');
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `string_art_pattern_${timestamp}.txt`;
    
    // Create export directory if it doesn't exist
    const exportDir = `${RNFS.DownloadDirectoryPath}/StringArt`;
    const dirExists = await RNFS.exists(exportDir);
    if (!dirExists) {
      await RNFS.mkdir(exportDir);
    }
    
    const filePath = `${exportDir}/${fileName}`;
    
    // Generate text content
    let content = '# String Art Pattern Export\n';
    content += `# Generated on: ${new Date().toLocaleString()}\n`;
    content += `# Total lines: ${lines.length}\n\n`;
    
    if (settings.nailCount) {
      content += `# Settings:\n`;
      content += `# Nails: ${settings.nailCount}\n`;
      content += `# Max Lines: ${settings.maxLines}\n`;
      content += `# Neighbor Avoidance: ${settings.neighborAvoidance}\n\n`;
    }
    
    content += '# Line connections (from_nail_id -> to_nail_id)\n';
    lines.forEach((line, index) => {
      content += `${index + 1}: ${line.from.id} -> ${line.to.id}\n`;
    });
    
    content += '\n# Coordinates format: nail_id,x,y\n';
    const uniqueNails = new Map();
    lines.forEach(line => {
      uniqueNails.set(line.from.id, line.from);
      uniqueNails.set(line.to.id, line.to);
    });
    
    Array.from(uniqueNails.values())
      .sort((a, b) => a.id - b.id)
      .forEach(nail => {
        content += `${nail.id},${nail.x.toFixed(2)},${nail.y.toFixed(2)}\n`;
      });

    await RNFS.writeFile(filePath, content, 'utf8');
    return filePath;
    
  } catch (error) {
    console.error('Export error:', error);
    throw new Error(`Failed to export text file: ${error.message}`);
  }
}

export async function exportToJSON(project) {
  try {
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
      throw new Error('Storage permission required to save files');
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `string_art_project_${timestamp}.json`;
    
    const exportDir = `${RNFS.DownloadDirectoryPath}/StringArt`;
    const dirExists = await RNFS.exists(exportDir);
    if (!dirExists) {
      await RNFS.mkdir(exportDir);
    }
    
    const filePath = `${exportDir}/${fileName}`;
    
    const exportData = {
      ...project,
      exportDate: new Date().toISOString(),
      version: '1.0.0',
      format: 'string-art-project'
    };
    
    await RNFS.writeFile(filePath, JSON.stringify(exportData, null, 2), 'utf8');
    return filePath;
    
  } catch (error) {
    console.error('JSON export error:', error);
    throw new Error(`Failed to export JSON file: ${error.message}`);
  }
}

export async function exportToCSV(lines) {
  try {
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
      throw new Error('Storage permission required to save files');
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `string_art_connections_${timestamp}.csv`;
    
    const exportDir = `${RNFS.DownloadDirectoryPath}/StringArt`;
    const dirExists = await RNFS.exists(exportDir);
    if (!dirExists) {
      await RNFS.mkdir(exportDir);
    }
    
    const filePath = `${exportDir}/${fileName}`;
    
    let csvContent = 'line_number,from_nail_id,from_x,from_y,to_nail_id,to_x,to_y,length\n';
    
    lines.forEach((line, index) => {
      const length = Math.sqrt(
        Math.pow(line.to.x - line.from.x, 2) + 
        Math.pow(line.to.y - line.from.y, 2)
      ).toFixed(2);
      
      csvContent += `${index + 1},${line.from.id},${line.from.x.toFixed(2)},${line.from.y.toFixed(2)},${line.to.id},${line.to.x.toFixed(2)},${line.to.y.toFixed(2)},${length}\n`;
    });

    await RNFS.writeFile(filePath, csvContent, 'utf8');
    return filePath;
    
  } catch (error) {
    console.error('CSV export error:', error);
    throw new Error(`Failed to export CSV file: ${error.message}`);
  }
}

export async function exportStatistics(lines, nails, settings = {}) {
  try {
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
      throw new Error('Storage permission required to save files');
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `string_art_stats_${timestamp}.txt`;
    
    const exportDir = `${RNFS.DownloadDirectoryPath}/StringArt`;
    const dirExists = await RNFS.exists(exportDir);
    if (!dirExists) {
      await RNFS.mkdir(exportDir);
    }
    
    const filePath = `${exportDir}/${fileName}`;
    
    // Calculate statistics
    const totalLength = lines.reduce((sum, line) => {
      return sum + Math.sqrt(
        Math.pow(line.to.x - line.from.x, 2) + 
        Math.pow(line.to.y - line.from.y, 2)
      );
    }, 0);
    
    const nailUsage = new Map();
    lines.forEach(line => {
      nailUsage.set(line.from.id, (nailUsage.get(line.from.id) || 0) + 1);
      nailUsage.set(line.to.id, (nailUsage.get(line.to.id) || 0) + 1);
    });
    
    const avgUsage = Array.from(nailUsage.values()).reduce((a, b) => a + b, 0) / nailUsage.size;
    const maxUsage = Math.max(...nailUsage.values());
    const minUsage = Math.min(...nailUsage.values());
    
    let content = '# String Art Pattern Statistics\n';
    content += `Generated: ${new Date().toLocaleString()}\n\n`;
    
    content += '## Pattern Information\n';
    content += `Total Nails: ${nails.length}\n`;
    content += `Total Lines: ${lines.length}\n`;
    content += `Total Thread Length: ${totalLength.toFixed(2)} units\n\n`;
    
    content += '## Settings Used\n';
    if (settings.nailCount) content += `Nail Count: ${settings.nailCount}\n`;
    if (settings.maxLines) content += `Max Lines: ${settings.maxLines}\n`;
    if (settings.neighborAvoidance) content += `Neighbor Avoidance: ${settings.neighborAvoidance}\n`;
    content += '\n';
    
    content += '## Nail Usage Statistics\n';
    content += `Average connections per nail: ${avgUsage.toFixed(2)}\n`;
    content += `Maximum connections: ${maxUsage}\n`;
    content += `Minimum connections: ${minUsage}\n`;
    content += `Coverage: ${((nailUsage.size / nails.length) * 100).toFixed(1)}% of nails used\n\n`;
    
    content += '## Most Used Nails\n';
    const sortedUsage = Array.from(nailUsage.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
    
    sortedUsage.forEach(([nailId, usage], index) => {
      content += `${index + 1}. Nail ${nailId}: ${usage} connections\n`;
    });

    await RNFS.writeFile(filePath, content, 'utf8');
    return filePath;
    
  } catch (error) {
    console.error('Statistics export error:', error);
    throw new Error(`Failed to export statistics: ${error.message}`);
  }
}
