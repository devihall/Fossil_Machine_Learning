import { openTab } from "./components/menuTabs.js"; 
import { loadCategories } from "./components/categories.js";
import { dataFeed } from "./components/dataSet.js";
import { initModel, resetModel } from "./components/model.js";
// import { initModel, resetModel } from "./components/model-cnn.js";
import { randomizeData } from "./components/dataSet.js";
import { trainModel } from "./components/traning.js";
import { readURL, classify } from "./components/classification.js";

let myClassifier;
let trainingResults;
let categories;

// Menu tabs
function handleTabs(tabName = 'datasets') {
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
async function loadModel(categories) {
  myClassifier = await initModel(categories);
  console.log('Model loaded');
}

// Feed the model with random data
function handleRandFeed(num) {
  if (!myClassifier) {
    console.log('Classifier is not initialized yet.');
    return;
  }
  randomizeData(num, myClassifier);
}

// Train the model
function handleTraining() {
  if (!myClassifier) {
    console.log('Classifier is not initialized yet.');
    return;
  } 
  trainingResults = trainModel(myClassifier);
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
  classify(myClassifier);
}

handleTabs();
loadModel(categories);


window.handleTabs = handleTabs;
window.handleRandFeed = handleRandFeed;  
window.handleTraining = handleTraining;  
window.handleReset = handleReset;
window.handleClasificationFile = handleClasificationFile;
window.handleClasification = handleClasification;