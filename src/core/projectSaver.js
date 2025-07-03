// src/core/projectSaver.js

import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';
import { Alert, PermissionsAndroid, Platform } from 'react-native';

const PROJECT_KEY_PREFIX = 'stringart_project_';
const PROJECTS_LIST_KEY = 'stringart_projects_list';

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

export async function saveProject(project, projectName = null) {
  try {
    const timestamp = new Date().toISOString();
    const projectId = Date.now().toString();
    
    const projectData = {
      id: projectId,
      name: projectName || `String Art ${new Date().toLocaleDateString()}`,
      ...project,
      savedAt: timestamp,
      version: '1.0.0'
    };

    // Save to AsyncStorage for quick access
    const projectKey = `${PROJECT_KEY_PREFIX}${projectId}`;
    await AsyncStorage.setItem(projectKey, JSON.stringify(projectData));

    // Update projects list
    await addToProjectsList(projectData);

    // Also save to external storage for backup
    await saveProjectToFile(projectData);

    return projectId;
  } catch (error) {
    console.error('Save project error:', error);
    throw new Error(`Failed to save project: ${error.message}`);
  }
}

export async function loadProject(projectId = null) {
  try {
    if (projectId) {
      // Load specific project
      const projectKey = `${PROJECT_KEY_PREFIX}${projectId}`;
      const projectData = await AsyncStorage.getItem(projectKey);
      return projectData ? JSON.parse(projectData) : null;
    } else {
      // Load most recent project
      const projectsList = await getProjectsList();
      if (projectsList.length === 0) return null;
      
      const mostRecent = projectsList.sort((a, b) => 
        new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
      )[0];
      
      return await loadProject(mostRecent.id);
    }
  } catch (error) {
    console.error('Load project error:', error);
    throw new Error(`Failed to load project: ${error.message}`);
  }
}

export async function getProjectsList() {
  try {
    const projectsListData = await AsyncStorage.getItem(PROJECTS_LIST_KEY);
    return projectsListData ? JSON.parse(projectsListData) : [];
  } catch (error) {
    console.error('Get projects list error:', error);
    return [];
  }
}

export async function deleteProject(projectId) {
  try {
    // Remove from AsyncStorage
    const projectKey = `${PROJECT_KEY_PREFIX}${projectId}`;
    await AsyncStorage.removeItem(projectKey);

    // Update projects list
    await removeFromProjectsList(projectId);

    // Remove from external storage
    await deleteProjectFile(projectId);

    return true;
  } catch (error) {
    console.error('Delete project error:', error);
    throw new Error(`Failed to delete project: ${error.message}`);
  }
}

export async function renameProject(projectId, newName) {
  try {
    const project = await loadProject(projectId);
    if (!project) throw new Error('Project not found');

    project.name = newName;
    project.modifiedAt = new Date().toISOString();

    // Save updated project
    const projectKey = `${PROJECT_KEY_PREFIX}${projectId}`;
    await AsyncStorage.setItem(projectKey, JSON.stringify(project));

    // Update projects list
    await updateProjectInList(project);

    return true;
  } catch (error) {
    console.error('Rename project error:', error);
    throw new Error(`Failed to rename project: ${error.message}`);
  }
}

export async function duplicateProject(projectId, newName = null) {
  try {
    const originalProject = await loadProject(projectId);
    if (!originalProject) throw new Error('Project not found');

    const duplicatedProject = {
      ...originalProject,
      id: undefined, // Will be generated in saveProject
      name: newName || `${originalProject.name} (Copy)`,
      savedAt: undefined, // Will be set in saveProject
      modifiedAt: undefined
    };

    return await saveProject(duplicatedProject, duplicatedProject.name);
  } catch (error) {
    console.error('Duplicate project error:', error);
    throw new Error(`Failed to duplicate project: ${error.message}`);
  }
}

export async function exportProjectToFile(projectId) {
  try {
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
      throw new Error('Storage permission required to export files');
    }

    const project = await loadProject(projectId);
    if (!project) throw new Error('Project not found');

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `${project.name.replace(/[^a-zA-Z0-9]/g, '_')}_${timestamp}.json`;
    
    const exportDir = `${RNFS.DownloadDirectoryPath}/StringArt/Projects`;
    const dirExists = await RNFS.exists(exportDir);
    if (!dirExists) {
      await RNFS.mkdir(exportDir);
    }
    
    const filePath = `${exportDir}/${fileName}`;
    await RNFS.writeFile(filePath, JSON.stringify(project, null, 2), 'utf8');
    
    return filePath;
  } catch (error) {
    console.error('Export project error:', error);
    throw new Error(`Failed to export project: ${error.message}`);
  }
}

export async function importProjectFromFile(filePath) {
  try {
    const fileContent = await RNFS.readFile(filePath, 'utf8');
    const projectData = JSON.parse(fileContent);

    // Validate project data
    if (!projectData.nails || !projectData.lines) {
      throw new Error('Invalid project file format');
    }

    // Import as new project
    const importedProjectId = await saveProject(projectData, 
      `${projectData.name || 'Imported Project'} (Imported)`);
    
    return importedProjectId;
  } catch (error) {
    console.error('Import project error:', error);
    throw new Error(`Failed to import project: ${error.message}`);
  }
}

export async function getProjectStatistics() {
  try {
    const projectsList = await getProjectsList();
    
    const stats = {
      totalProjects: projectsList.length,
      totalSize: 0,
      oldestProject: null,
      newestProject: null,
      averageLinesPerProject: 0,
      averageNailsPerProject: 0
    };

    if (projectsList.length === 0) return stats;

    let totalLines = 0;
    let totalNails = 0;

    for (const projectInfo of projectsList) {
      try {
        const project = await loadProject(projectInfo.id);
        if (project) {
          totalLines += project.lines?.length || 0;
          totalNails += project.nails?.length || 0;
          
          // Calculate approximate size
          stats.totalSize += JSON.stringify(project).length;
        }
      } catch (err) {
        console.warn('Error loading project for stats:', err);
      }
    }

    stats.averageLinesPerProject = Math.round(totalLines / projectsList.length);
    stats.averageNailsPerProject = Math.round(totalNails / projectsList.length);

    // Find oldest and newest
    const sortedByDate = projectsList.sort((a, b) => 
      new Date(a.savedAt).getTime() - new Date(b.savedAt).getTime()
    );
    
    stats.oldestProject = sortedByDate[0];
    stats.newestProject = sortedByDate[sortedByDate.length - 1];

    return stats;
  } catch (error) {
    console.error('Get statistics error:', error);
    return null;
  }
}

// Helper functions
async function addToProjectsList(projectData) {
  const projectsList = await getProjectsList();
  const projectInfo = {
    id: projectData.id,
    name: projectData.name,
    savedAt: projectData.savedAt,
    linesCount: projectData.lines?.length || 0,
    nailsCount: projectData.nails?.length || 0,
    settings: projectData.settings
  };
  
  projectsList.push(projectInfo);
  await AsyncStorage.setItem(PROJECTS_LIST_KEY, JSON.stringify(projectsList));
}

async function removeFromProjectsList(projectId) {
  const projectsList = await getProjectsList();
  const filteredList = projectsList.filter(p => p.id !== projectId);
  await AsyncStorage.setItem(PROJECTS_LIST_KEY, JSON.stringify(filteredList));
}

async function updateProjectInList(projectData) {
  const projectsList = await getProjectsList();
  const index = projectsList.findIndex(p => p.id === projectData.id);
  
  if (index >= 0) {
    projectsList[index] = {
      id: projectData.id,
      name: projectData.name,
      savedAt: projectData.savedAt,
      modifiedAt: projectData.modifiedAt,
      linesCount: projectData.lines?.length || 0,
      nailsCount: projectData.nails?.length || 0,
      settings: projectData.settings
    };
    await AsyncStorage.setItem(PROJECTS_LIST_KEY, JSON.stringify(projectsList));
  }
}

async function saveProjectToFile(projectData) {
  try {
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) return;

    const backupDir = `${RNFS.DownloadDirectoryPath}/StringArt/Backups`;
    const dirExists = await RNFS.exists(backupDir);
    if (!dirExists) {
      await RNFS.mkdir(backupDir);
    }

    const fileName = `project_${projectData.id}.json`;
    const filePath = `${backupDir}/${fileName}`;
    await RNFS.writeFile(filePath, JSON.stringify(projectData), 'utf8');
  } catch (error) {
    console.warn('Failed to save project backup:', error);
  }
}

async function deleteProjectFile(projectId) {
  try {
    const filePath = `${RNFS.DownloadDirectoryPath}/StringArt/Backups/project_${projectId}.json`;
    const exists = await RNFS.exists(filePath);
    if (exists) {
      await RNFS.unlink(filePath);
    }
  } catch (error) {
    console.warn('Failed to delete project backup:', error);
  }
}
