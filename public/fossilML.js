
import { loadCategories } from "./components/categories.js";
import { resetModel } from "./components/traning.js";
import { initModel } from "./components/model.js";

const myClassifier = initModel();
const categories = loadCategories('json');

console.log("categories", categories);

// resetModel();
// let item;
// let trainingCategories;// training categories
// let classificationCategories;
let categoryName;
let accuracyData = [];



// when images are loaded manually- call load categories
function loadManually() {
  loadCategories();
}

// console.log("categoryname outside", categoryName);
// console.log(categoryNames["isurus_hastalis"]);

// loadManually which is calling loadCategories
loadCategories("json");
// loadManually();
