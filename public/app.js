import { openTab } from "./components/menuTabs.js"; 
import { loadCategories } from "./components/categories.js";
import { dataFeed } from "./components/dataSet.js";
import { initModelFE, initModelCNN, resetModel } from "./components/model.js";
import { randomizeData } from "./components/dataSet.js";
import { trainModelFE, trainModelCNN } from "./components/traning.js";
import { readURL, classify } from "./components/classification.js";
import { showSpinner, hideSpinner } from './components/spinner.js'; 

let myClassifier;
let trainingResults;
let categories;
let modelType = 'FE';
let width;
let height;
let channels = 4;

if (modelType === 'CNN') {
  console.log('Using CNN model');
}


// Menu tabs
function handleTabs(tabName = 'training') {
  openTab(tabName);

  switch (tabName) {
    case 'datasets':
      categories = loadCategories('feed', 'datasets');
      dataFeed();
      break;
    case 'training':
      categories = loadCategories('json', 'training');
      break;
    default:
      break;
    }
}

// Load the model
async function loadModel(modelType) {
  console.log('Loading model', modelType);
  if (modelType === 'FE') {
    console.log('Using FE model');
    myClassifier = await initModelFE();
  } else {
    myClassifier = await initModelCNN(width, height, channels);
  }
  console.log('Model loaded');
}

// Feed the model with random data
function handleRandFeed(num) {
  if (!myClassifier) {
    console.log('Classifier is not initialized yet.');
    return;
  }
  
  randomizeData(num, myClassifier, modelType, width, height);
}

// Train the model
function handleTraining() {
  if (!myClassifier) {
    console.log('Classifier is not initialized yet.');
    return;
  } 
  if (modelType === 'FE') {
    trainingResults = trainModelFE(myClassifier);
  } else {
    trainingResults = trainModelCNN(myClassifier);
  }
}

// Handle reset button
export function handleReset() {
  resetModel(myClassifier, trainingResults);
  loadModel(categories);
}

// Handle image classification file
export function handleClasificationFile(input) {
  readURL(input);
}

// Handle image classification
export function handleClasification() {
  if (!myClassifier) {
    console.log('Classifier is not initialized yet.');
    return;
  }
  classify(myClassifier, modelType, width, height);
}

function setupModelTypeChangeListener() {
  const modelTypeSelector = document.getElementById('modelType');
  modelTypeSelector.addEventListener('change', function() {
    modelType = this.value;
    resetModel(myClassifier, trainingResults);
    console.log('Model type changed to:', modelType);
    loadModel(modelType);
  });
}

function handleImageResolution() {
  showSpinner("Resizing images.... This process may take a while, it will continue in the background.");
  const selectedSize = document.getElementById('resolution').value;
  const dimensions = selectedSize.split('x');
  const width = parseInt(dimensions[0], 10);
  const height = parseInt(dimensions[1], 10);

  console.log('Requesting image resize to:', width, 'x', height);

  const postData = {
    width: width,
    height: height
  };

  fetch('/resize-script', {
    method: 'POST', 
    headers: {
      'Content-Type': 'application/json' 
    },
    body: JSON.stringify(postData)
  })
  .then(response => response.json()) 
  .then(data => {
    console.log('Resize operation completed:', data); 
    updateConfig('RESOLUTION', `${width}x${height}`);
    hideSpinner();
  })
  .catch(error => {
    console.error('Error resizing images:', error); 
    hideSpinner();
  });
}

function updateConfig(key, value) {
  // Prepare data for writing to the config
  const configData = {
    key: key,
    value: value
  };

  // Fetch call to write to the config
  fetch('/write-config', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(configData)
  })
  .then(response => response.json())
  .then(data => {
    console.log('Configuration update successful:', data);
  })
  .catch(error => {
    console.error('Error updating configuration:', error);
  });
}

// Fetch all configuration data
function fetchAllConfigData() {
  fetch('/read-config')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch configuration');
      }
      return response.json();
    })
    .then(data => {
      if (data.status === 'success') {
        const configs = data.configuration;
        // Example of destructuring configurations into variables
        const { RESOLUTION } = configs;
        console.log('Configuration retrieved:', configs);
        console.log('Resolution:', RESOLUTION);
        // Set width and height
        const dimensions = RESOLUTION.split('x');
        width = parseInt(dimensions[0], 10);
        height = parseInt(dimensions[1], 10);

        // Set the resolution dropdown
        setResolutionDropdown(RESOLUTION);

      } else {
        throw new Error('Error in response data');
      }
    })
    .catch(error => {
      console.error('Error fetching configuration:', error);
    });
}

// Helper function to set the dropdown selection
function setResolutionDropdown(resolution) {
  const selectElement = document.getElementById('resolution');
  if (selectElement) {
    selectElement.value = resolution;
  } else {
    console.error('Resolution select element not found');
  }
}


fetchAllConfigData();
handleTabs();
loadModel(modelType);
setupModelTypeChangeListener();


window.handleTabs = handleTabs;
window.handleRandFeed = handleRandFeed;  
window.handleTraining = handleTraining;  
window.handleReset = handleReset;
window.handleClasificationFile = handleClasificationFile;
window.handleClasification = handleClasification;
window.handleImageResolution = handleImageResolution;