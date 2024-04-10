
import { openTab } from "./components/menuTabs.js"; 
import { loadCategories } from "./components/categories.js";
import { initModel, resetModel } from "./components/model.js";
import { randomizeData } from "./components/dataSet.js";
import { trainModel } from "./components/traning.js";
import { readURL, classify } from "./components/classification.js";

let myClassifier;
let trainingResults;

// Menu tabs
function handleTabs(tabName) {
  openTab(tabName);
}

// Load categories and model
const categories = loadCategories('json');

loadModel(categories);

// Load the model
async function loadModel(categories) {
  myClassifier = await initModel(categories);
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




window.handleRandFeed = handleRandFeed;  
window.handleTraining = handleTraining;  
window.handleReset = handleReset;
window.handleTabs = handleTabs;
window.handleClasificationFile = handleClasificationFile;
window.handleClasification = handleClasification;


