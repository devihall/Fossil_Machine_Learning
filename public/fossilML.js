////////// logic for tabbed navigation/////////
function openTab(tabName) {
  // Hide all tabs
  var tabs = document.getElementsByClassName("tab");
  for (var i = 0; i < tabs.length; i++) {
    tabs[i].classList.remove("active");
  }

  // Deactivate all tab buttons
  var tabButtons = document.getElementsByClassName("tab-button");
  for (var i = 0; i < tabButtons.length; i++) {
    tabButtons[i].classList.remove("active");
  }

  // Show the selected tab
  document.getElementById(tabName).classList.add("active");

  // Activate the selected tab button
  document
    .querySelector("[onclick*='" + tabName + "']")
    .classList.add("active");
}

/////////logic for Feature Extraction & model re-training//////////

// Initialize the MobileNet model
let myimages = [];
let img;
let currentIndex = 0;
let allImages = [];
let predictions = [];
// Initialize an array to store loss values
let lossData = [];
let trainingResults;
let loss;
let epoch;
let surface;
let jsonResponse = [];
let categoryCount = 0;
let classificationResults;
// let item;
// let trainingCategories;// training categories
// let classificationCategories;
let categories;
let categoryName;
let accuracyData = [];
const plotaccuracyData = {};
// labels before training, prediction
// plotaccuracyData = {
//                      labelBT: ['cat1', 'cat2'],
//                      predictionLabel: 'cat1',
//                      epoch: [1,2,3,4,5,6,7..]
//                     }
// push values

// initialize featureExtractor & image Classifier
const options = {
  debug: true,
  metrics: ["accuracy"],
};

const myfeatureExtractor = ml5.featureExtractor(
  "MobileNet",
  modelReady,
  options
);

// const myfeatureExtractor = ml5.featureExtractor(
//   "MobileNet",
//   modelReady,
//   options
// );
let myClassifier = myfeatureExtractor.classification(myimages, {
  numLabels: categoryCount,
});

console.log("myimages", myimages);

// Function to handle model loading
function modelReady() {
  console.log("Model is ready");
}

//Function to handle Loading categories from categories JSON
async function loadCategories(inputType) {
  resetModel();
  // Fetch and parse the categories.json file
  const response = await fetch("categories.json");
  categories = await response.json();
  categoryCount = categories.length;

  console.log("categories inside loadCategories", categories);

  // Get the container where we want to add the categories
  const container = document.getElementById("categoriesContainer");
  container.innerHTML = ""; // Clear the container

  // initialize Feature Extractor & Classifier
  const featureExtractor = ml5.featureExtractor("MobileNet", modelReady);
  myClassifier = featureExtractor.classification(myimages, {
    numLabels: categoryCount,
  });

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
          <div id="thumbnailContainer${category.id}" class="d-flex flex-wrap thumbnailContainer m-1"></div>
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

// when images are loaded manually- call load categories
function loadManually() {
  loadCategories();
}

// function to create json file from the images(excutes the shell script)- excutes when number button is clicked
function executeShellScript(num) {
  fetch("/execute-script", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ num }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);

      // load the newly created json file
      loadJsonFile("/images/dataSets/sharks.json");
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// loading newly created JSON file (that has images as property values)
async function loadJsonFile(filePath) {
  try {
    const response = await fetch(filePath);
    jsonResponse = await response.json();
    console.log("JSON file loaded successfully");
    await loadImagesFromJson();
  } catch (error) {
    console.error("Error loading or parsing JSON:", error);
  }
}

// loading image data from newly created JSON file
async function loadImagesFromJson() {
  const timeout = 10000; // Timeout in milliseconds, e.g., 10000 for 10 seconds
  let timeoutId;

  // Show the rectangle spinner
  document.getElementById("rectangle-spinner").style.display = "flex";

  // Start a timer to hide the spinner after the timeout period
  timeoutId = setTimeout(() => {
    console.log("Timeout reached, hiding spinner.");
    document.getElementById("rectangle-spinner").style.display = "none";
  }, timeout);

  // load categories
  await loadCategories("json");
  const thumbnailContainers =
    document.getElementsByClassName("thumbnailContainer");
  Array.from(thumbnailContainers).forEach(
    (container) => (container.innerHTML = "")
  );

  const imagePromises = [];

  for (let item of jsonResponse) {
    const img = new Image();
    img.width = 100;
    img.height = 100;

    img.src = item.image;

    // load categories from json file into thumbnail containers
    const thumbnailContainer = document.getElementById(
      "thumbnailContainer" + item.category
    );
    if (!thumbnailContainer) {
      console.log(
        `There are no images with these categories: ${item.category}`
      );
      continue;
    }

    // Function to RANDOMLY add Thumbnails to UI
    const imagePromise = new Promise((resolve, reject) => {
      img.onload = () => {
        const thumbnailDiv = document.createElement("div");
        thumbnailDiv.classList.add("thumbnail");
        thumbnailDiv.appendChild(img);
        thumbnailContainer.appendChild(thumbnailDiv);

        // console.log(`Adding ${item.image} to category ${item.category}`);

        // add images to model for re-training
        myClassifier.addImage(img, item.category).then(resolve);
      };
      console.log("<<<<USE THIS addImage>>>>");

      img.onerror = () => {
        console.log(`Error loading image: ${item.image}`);
        reject(new Error(`Failed to load image: ${item.image}`));
      };
    });
    imagePromises.push(imagePromise);
  }

  try {
    await Promise.all(imagePromises);
    console.log("All images loaded.");
  } catch (error) {
    console.log("An error occurred while loading images:", error);
  } finally {
    // Clear the timeout and hide the spinner
    clearTimeout(timeoutId);
    document.getElementById("rectangle-spinner").style.display = "none";
  }
}

// Function to MANUALLY add training image files to model
async function handleFileInput(inputId) {
  const input = document.getElementById(inputId);
  console.log("input", input);
  const promises = [];
  const thumbnailContainer = document.getElementById(
    "thumbnailContainer" + inputId
  );
  thumbnailContainer.innerHTML = ""; // Clear previous thumbnails

  const numFiles = input.files.length;
  if (numFiles < 2) {
    // Show bootstrap alert to "Select 2 or more files"
    const alertElement = document.createElement("div");
    // Show bootstrap alert
    alertElement.classList.add("alert", "alert-danger");
    alertElement.textContent = "Please select two or more files";

    // Append the alert to the trainingMessage div
    const trainingMessageDiv = document.getElementById("trainingMessage");
    trainingMessageDiv.appendChild(alertElement);

    // Remove the alert after a delay
    setTimeout(() => {
      alertElement.remove();
    }, 5000); // Remove after 5 seconds (adjust as needed)
    return; // Exit the function
  }

  // Continue with handling files if more than one file is selected
  for (let i = 0; i < input.files.length; i++) {
    console.log("input.files", input.files);

    const file = input.files[i];

    // Create a new image element
    const img = document.createElement("img");
    img.width = 100; // Set width for display purposes
    img.height = 100; // Set height for display purposes

    img.src = URL.createObjectURL(file);
    console.log("FILE", file);

    // Function to add Thumbnails to UI
    const thumbnailDiv = document.createElement("div");
    thumbnailDiv.classList.add("thumbnail");
    thumbnailDiv.appendChild(img);
    thumbnailContainer.appendChild(thumbnailDiv);

    // add uploaded images to myimages array
    // myimages.push(img);

    // Use the h4TextContent as the category
    let category = inputId;
    console.log("category = inputId", category);

    console.log("IMG", img);
    // add training images to model (manual)
    promises.push(myClassifier.addImage(img, category));
  }
  // Wait for all images to be added before starting training
  await Promise.all(promises).then(() => {
    console.log("All images loaded.");
  });
}

// Function to train model
async function trainModel() {
  console.log("Starting training...");

  // ask model to train with the new data
  myClassifier
    .train(whileTraining)
    .then((results) => {
      console.log("Training complete", results);
      console.log("Training onEpochEnd", results.onEpochEnd());


      // Update the UI and visualize the training results
      const trainingMessageContainer =
        document.getElementById("trainingMessage");
      trainingMessageContainer.innerHTML = `
              <div class="alert alert-success" role="alert">
                  Training complete! Check the Performance tab for how the model did.
              </div>`;

      // get loss data
      const lossDataForVisualization = results.epoch.map(
        (epochValue, index) => ({
          x: epochValue,
          y: results.history.loss[index],
        })
      );
      const data = {
        values: [lossDataForVisualization],
        series: ["Loss vs Epoch"],
      };

      // get container for loss graph
      const container = document.getElementById("demo");
      const options = {
        xLabel: "Epoch",
        yLabel: "Loss",
      };
      // create loss graph
      tfvis.render.linechart(container, data, options);
    })
    .catch((error) => {
      console.error("Error during training:", error);
    });
}

////////////

// // Function to be called on batch end
// async function onBatchEnd(batch, logs) {
//   console.log("HI")
//   const predictions = myClassifier.model.predict(myClassifier.xs);
//   // Log or process the predictions as needed
//   console.log('Batch:', batch, 'Predictions:', predictions.arraySync());
// }
/////////
// visualize accuracy
// function plotAccuracy( cat,  accuracyCalculated) {
  function plotAccuracy( accuracyObj) {

  console.log("Plotting accuracy...");
  console.log("hello world");
  console.log("hcategories inside visualize", accuracyObj.cat);
  console.log("accuracy plotacc", accuracyCalculated);
}

// function to call when model is training
async function whileTraining(epoch, loss) {
  console.log("model is training");
  //////
  console.log(`Epoch: ${epoch}, Loss: ${loss}`);
  //// Calculate accuracy (this is just a placeholder, replace it with actual accuracy calculation)
  
  //////
  // Display "Model is training" message
  const trainingMessageContainer = document.getElementById("trainingMessage");
  trainingMessageContainer.innerHTML = `
        <div class="alert alert-info" role="alert">
            Model is training...
        </div>`;

        


}

// function to reset the model
async function resetModel() {
  trainingResults = null;
  // Check if myClassifier exists and has a clear method
  if (myClassifier && myClassifier.clear) {
    myClassifier.clear();
    console.log("Classifier data cleared.");
  }

  // Reinitialize the Feature Extractor CLassifier after re-setting
  const featureExtractor = ml5.featureExtractor("MobileNet", modelReady);
  myClassifier = featureExtractor.classification(myimages, {
    numLabels: categoryCount,
  });
  console.log("Classifier reinitialized.");

  // Reset the UI elements- clear image containers and print "reset" message to UI
  const thumbnailContainers = document.querySelectorAll(".thumbnailContainer");
  thumbnailContainers.forEach((container) => {
    container.innerHTML = "";
  });
  const trainingMessageContainer = document.getElementById("trainingMessage");
  trainingMessageContainer.innerHTML = "";

  console.log("Model and UI have been reset.");
}

///////// logic for classifying single test image//////
function readURL(input) {
  console.log("choose image clicked");
  // input test image for classification
  if (input.files && input.files[0]) {
    $("#classify").prop("disabled", false);
    var reader = new FileReader();

    reader.onload = function (e) {
      $("#image").attr("src", e.target.result);
    };

    reader.readAsDataURL(input.files[0]);
  }
}

// logic for image classification with retrained model
function classify() {
  console.log("classify button clicked");
  $("#classify").prop("disabled", true);

  const element = $("#result");
  // print "Detecting..." message to the UI
  element.html("Detecting...").addClass("border");

  // Clear the content of the result div
  element.empty();
  const img = document.getElementById("image");

  // Ask Image Classifier to classify test image
  myClassifier.classify(img, gotResult);

  // Move the #result div below the "Choose Image" and "Classify" button
  const resultContainer = $(".buttonList");
  const existingElement = $(".result-container");
  if (existingElement.length === 0) {
    resultContainer.after(
      '<div class="result-container p-2 mt-3" style="width: 300px;"></div>'
    );
  }
  resultContainer.parent().find(".result-container").html(element);

  let categoryNames = {};

  // get categories from json file
  async function loadCategoryNames() {
    const response = await fetch("categories.json");
    categories = await response.json();

    // Convert the array of category names to a dictionary by assigning an id to each category
    categoryNames = categories.reduce((obj, category) => {
      obj[category.id] = category.name;
      return obj;
    }, {});

    // save training categories to an array
    //  trainingCategories = categories;
  }

  // Function to run when classification results arrive
  async function gotResult(error, classificationResults) {
    console.log("in gotResult function");

    if (Object.keys(categoryNames).length === 0) {
      await loadCategoryNames();
    }

    if (error) {
      console.log(error);
      // if images are not added for classification, print error message to UI
      const errorMessage = $(
        "<div class='alert alert-danger alert-dismissible fade show' role='alert'>" +
          "Train the model before using the classifier" +
          "<button type='button' class='btn-close' data-bs-dismiss='alert' aria-label='Close'></button>" +
          "</div>"
      );
      // add "classifier not ready" message to classification Results container
      $("#classifierMessage").append(errorMessage);
      element.html("classifier not ready!");
      setTimeout(() => {
        errorMessage.remove();
        element.remove();
      }, 3000); // Remove after 5 seconds (adjust as needed
    } else {
      console.log("classification results", classificationResults);

      // print label and confidence to screen
      let num = classificationResults[0].confidence * 100;
      const categoryID = classificationResults[0].label;
      categoryName = categoryNames[categoryID] || "Unknown Category";

      console.log("categoryname", categoryName);
      // console.log("categoryID", categoryID);


      element.html(
        "<h5>" +
          categoryName +
          "</h5> Confidence: <b>" +
          num.toFixed(2) +
          "%</b>"
      );
    }
  }
}

// console.log("categoryname outside", categoryName);
// console.log(categoryNames["isurus_hastalis"]);

// loadManually which is calling loadCategories
loadCategories("json");
loadManually();
