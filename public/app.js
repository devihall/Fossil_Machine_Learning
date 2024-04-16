import { openTab } from "./components/menuTabs.js"; 
import { loadCategories } from "./components/categories.js";
import { dataFeed } from "./components/dataSet.js";
import { initModelFE, initModelCNN, resetModel } from "./components/model.js";
import { randomizeData } from "./components/dataSet.js";
import { trainModelFE, trainModelCNN } from "./components/traning.js";
import { readURL, classify } from "./components/classification.js";

let myClassifier;
let trainingResults;
let categories;
let modelType = 'FE';

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
async function loadModel(categories, modelType) {
  console.log('Loading model', modelType);
  if (modelType === 'FE') {
    console.log('Using FE model');
    myClassifier = await initModelFE(categories);
  } else {
    myClassifier = await initModelCNN();
  }
  console.log('Model loaded');
}

// Feed the model with random data
function handleRandFeed(num) {
  if (!myClassifier) {
    console.log('Classifier is not initialized yet.');
    return;
  }
  randomizeData(num, myClassifier, modelType);
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
  classify(myClassifier, modelType);
}

function setupModelTypeChangeListener() {
  const modelTypeSelector = document.getElementById('modelType');
  modelTypeSelector.addEventListener('change', function() {
    modelType = this.value;
    resetModel(myClassifier, trainingResults);
    console.log('Model type changed to:', modelType);
    loadModel(categories, modelType);
  });
}

handleTabs();
loadModel(categories, modelType);
setupModelTypeChangeListener();


window.handleTabs = handleTabs;
window.handleRandFeed = handleRandFeed;  
window.handleTraining = handleTraining;  
window.handleReset = handleReset;
window.handleClasificationFile = handleClasificationFile;
window.handleClasification = handleClasification;