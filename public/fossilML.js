
import { loadCategories } from "./components/categories.js";
import { initModel, resetModel } from "./components/model.js";
import { randomizeData } from "./components/dataSet.js";

let myClassifier;

async function loadModel(categories) {
  myClassifier = await initModel(categories);
}

export function handleRandButton(num) {
  if (!myClassifier) {
    console.log('Classifier is not initialized yet.');
    return;
  }
  randomizeData(num, myClassifier);
}

const categories = loadCategories('json');
loadModel(categories);


console.log("categories", categories);

// resetModel();
// let item;
// let trainingCategories;// training categories
// let classificationCategories;
let categoryName;
let accuracyData = [];
let num;


window.handleRandButton = handleRandButton;  




// console.log("categoryname outside", categoryName);
// console.log(categoryNames["isurus_hastalis"]);

// loadManually which is calling loadCategories

// loadManually();
