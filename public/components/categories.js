

//Function to handle Loading categories from categories JSON
export async function loadCategories(inputType, tab) {
  // Fetch and parse the categories.json file
  const response = await fetch("categories.json");
  const categories = await response.json();
  const categoryCount = categories.length;

  console.log("categories inside loadCategories", categories);
  let container;
  if (tab === "datasets") {
    // Get the container where we want to add the categories
    container = document.getElementById("datasetCategoriesContainer");
  } else {
    container = document.getElementById("trainingCategoriesContainer");
  }

  container.innerHTML = ""; // Clear the container
  createCategoryElement(categories, container, inputType);

  return categories;
}

function createCategoryElement(categories, container, inputType) {
  // Create a new row
  let row = document.createElement("div");
  row.className = "row";

  // Loop over each category and create columns
  categories.forEach((category, index) => {
   // Create a column for each category
   const col = document.createElement("div");
   col.className = "col-md-4 border p-3 wrapper"; // 'col-md-4' ensures three columns per row
   if (inputType === "json") {
     col.innerHTML = `
       <h4 class="category d-flex">${category.name}</h4>
       <div id="thumbnailContainer${category.id}" class="d-flex flex-wrap thumbnailContainer m-1"></div>
       <div class="p-2 mt-3" style="width: 300px;" id="result${category.id}"></div>
       `;
   } else {
     col.innerHTML = `
         <h4 class="category d-flex">${category.name}</h4>
         <input type="file" id="${category.id}" multiple accept="image/*" onchange="handleFileInput('${category.id}')">
         <div id="thumbnailContainer${category.id}-datasets" class="d-flex flex-wrap thumbnailContainer m-1"></div>
         <div class="p-2 mt-3" style="width: 300px;" id="result${category.id}"></div>
     `;
   }

   // Add the column to the current row
   row.appendChild(col);

   // If the index is at the end of a row or the end of the array, append the row to the container
   if ((index + 1) % 3 === 0 || index === categories.length - 1) {
     container.appendChild(row);
     // Create a new row for the next set of categories
     row = document.createElement("div");
     row.className = "row";
   }

 });
}


export async function categoryNames() {
  const response = await fetch("categories.json");
  const categories = await response.json();  
  if (Array.isArray(categories)) {
    return categories.reduce((obj, category) => {
      obj[category.id] = category.name;
      return obj;
    }, {});
  } else {
      console.error('Expected an array, but got:', categories);
  }
}
