import { loadCategories } from "./categories.js";
import { showSpinner, hideSpinner } from './spinner.js'; 


export async function dataFeed() {
  loadCategories("json", 'dataset');

  // add logic to feed dataset
}

// loading newly created JSON file (that has images as property values)
export async function loadData(filePath, myClassifier, modelType, width, height) {
  try {
    const response = await fetch(filePath);
    const jsonResponse = await response.json();
    console.log("JSON file loaded successfully");
    if (modelType === "FE") {
      console.log("Loading images for FE model");
      await loadImagesFromJsonFE(jsonResponse, myClassifier, width, height);
    } else {
      console.log("Loading images for CNN model");
      await loadImagesFromJsonCNN(jsonResponse, myClassifier, width, height);
    }

  } catch (error) {
    console.error("Error loading or parsing JSON:", error);
  }
}

export async function loadImagesFromJsonFE(data, myClassifier, width, height) {
  const timeout = 10000; // Timeout in milliseconds, e.g., 10000 for 10 seconds
  let timeoutId;

  showSpinner("Loading images to the model...");

  // Start a timer to hide the spinner after the timeout period
  timeoutId = setTimeout(() => {
    console.log("Timeout reached, hiding spinner.");
    hideSpinner();
  }, timeout);

  const thumbnailContainers = document.getElementsByClassName("thumbnailContainer");
  Array.from(thumbnailContainers).forEach(
    (container) => (container.innerHTML = "")
  );

  const imagePromises = [];

  for (let item of data) {
    const img = new Image();
    img.width = width;
    img.height = height;

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
    hideSpinner();
  }
}

export async function loadImagesFromJsonCNN(data, myClassifier, width, height) {
  const timeout = 10000; // Timeout in milliseconds
  let timeoutId;

  showSpinner("Loading images to the model...");

  // Setup timeout to hide the spinner after the specified period
  timeoutId = setTimeout(() => {
    console.log("Timeout reached, hiding spinner.");
    hideSpinner();
  }, timeout);

  // Clear existing thumbnails
  const thumbnailContainers = document.getElementsByClassName("thumbnailContainer");
  Array.from(thumbnailContainers).forEach(container => container.innerHTML = "");

  // Process each image
  const imagePromises = data.map(item => {
      return new Promise((resolve, reject) => {
          const img = new Image();
          img.width = width;
          img.height = height;  
          img.src = item.image;
          img.onload = () => {
              const thumbnailContainer = document.getElementById("thumbnailContainer" + item.category);
              if (!thumbnailContainer) {
                  console.log(`No container for category: ${item.category}`);
                  reject(new Error(`No container for category: ${item.category}`));
                  return;
              }

              const thumbnailDiv = document.createElement("div");
              thumbnailDiv.classList.add("thumbnail");
              thumbnailDiv.appendChild(img);
              thumbnailContainer.appendChild(thumbnailDiv);

              // Add image data to classifier for training
              myClassifier.addData({image: img}, {label: item.category });
              resolve();
          };
          img.onerror = () => {
              console.log(`Error loading image: ${item.image}`);
              reject(new Error(`Failed to load image: ${item.image}`));
          };
      });
  });

  try {
      await Promise.all(imagePromises);
      console.log("All images loaded.");
      myClassifier.normalizeData(); // Normalize data after all images are loaded
      console.log("Data normalized.");
  } catch (error) {
      console.log("An error occurred while loading images:", error);
  } finally {
      clearTimeout(timeoutId);
      hideSpinner();
  }
}
  



  
// function to create json file from the images(excutes the shell script)- excutes when number button is clicked
export async function randomizeData(num, myClassifier, modelType, width, height) {
  if (!num) {
    console.error("Please enter a number");
    return;
  }
  
  fetch("/randomizer-script", {
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
      loadData("/images/dataSets/sharks.json", myClassifier, modelType, width, height);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
