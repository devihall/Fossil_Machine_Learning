import { loadCategories } from "./categories.js";
// Function to MANUALLY add training image files to model
// export async function handleFileInput(inputId) {
//   const input = document.getElementById(inputId);
//   console.log("input", input);
//   const promises = [];
//   const thumbnailContainer = document.getElementById(
//     "thumbnailContainer" + inputId
//   );
//   thumbnailContainer.innerHTML = ""; // Clear previous thumbnails

//   const numFiles = input.files.length;
//   if (numFiles < 2) {
//     // Show bootstrap alert to "Select 2 or more files"
//     const alertElement = document.createElement("div");
//     // Show bootstrap alert
//     alertElement.classList.add("alert", "alert-danger");
//     alertElement.textContent = "Please select two or more files";

//     // Append the alert to the trainingMessage div
//     const trainingMessageDiv = document.getElementById("trainingMessage");
//     trainingMessageDiv.appendChild(alertElement);

//     // Remove the alert after a delay
//     setTimeout(() => {
//       alertElement.remove();
//     }, 5000); // Remove after 5 seconds (adjust as needed)
//     return; // Exit the function
//   }

//   // Continue with handling files if more than one file is selected
//   for (let i = 0; i < input.files.length; i++) {
//     console.log("input.files", input.files);

//     const file = input.files[i];

//     // Create a new image element
//     const img = document.createElement("img");
//     img.width = 100; // Set width for display purposes
//     img.height = 100; // Set height for display purposes

//     img.src = URL.createObjectURL(file);
//     console.log("FILE", file);

//     // Function to add Thumbnails to UI
//     const thumbnailDiv = document.createElement("div");
//     thumbnailDiv.classList.add("thumbnail");
//     thumbnailDiv.appendChild(img);
//     thumbnailContainer.appendChild(thumbnailDiv);

//     // add uploaded images to myimages array
//     // myimages.push(img);

//     // Use the h4TextContent as the category
//     let category = inputId;
//     console.log("category = inputId", category);

//     console.log("IMG", img);
//     // add training images to model (manual)
//     promises.push(myClassifier.addImage(img, category));
//   }
//   // Wait for all images to be added before starting training
//   await Promise.all(promises).then(() => {
//     console.log("All images loaded.");
//   });
// }

export async function dataFeed() {
  loadCategories("json", 'dataset');

  // add logic to feed dataset
}

// loading newly created JSON file (that has images as property values)
export async function loadData(filePath, myClassifier, modelType) {
  try {
    const response = await fetch(filePath);
    const jsonResponse = await response.json();
    console.log("JSON file loaded successfully");
    if (modelType === "FE") {
      console.log("Loading images for FE model");
      await loadImagesFromJsonFE(jsonResponse, myClassifier);
    } else {
      console.log("Loading images for CNN model");
      await loadImagesFromJsonCNN(jsonResponse, myClassifier);
    }

  } catch (error) {
    console.error("Error loading or parsing JSON:", error);
  }
}

export async function loadImagesFromJsonFE(data, myClassifier) {
  const timeout = 10000; // Timeout in milliseconds, e.g., 10000 for 10 seconds
  let timeoutId;

  // Show the rectangle spinner
  document.getElementById("rectangle-spinner").style.display = "flex";

  // Start a timer to hide the spinner after the timeout period
  timeoutId = setTimeout(() => {
    console.log("Timeout reached, hiding spinner.");
    document.getElementById("rectangle-spinner").style.display = "none";
  }, timeout);

  const thumbnailContainers = document.getElementsByClassName("thumbnailContainer");
  Array.from(thumbnailContainers).forEach(
    (container) => (container.innerHTML = "")
  );

  const imagePromises = [];

  for (let item of data) {
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

export async function loadImagesFromJsonCNN(data, myClassifier) {
  const timeout = 10000; // Timeout in milliseconds
  let timeoutId;

  // Show the spinner
  const spinner = document.getElementById("rectangle-spinner");
  spinner.style.display = "flex";

  // Start a timer to hide the spinner after the timeout period
  timeoutId = setTimeout(() => {
      console.log("Timeout reached, hiding spinner.");
      spinner.style.display = "none";
  }, timeout);

  console.log("Loading images from JSON data...");

  // Clear existing thumbnails
  const thumbnailContainers = document.getElementsByClassName("thumbnailContainer");
  Array.from(thumbnailContainers).forEach(container => container.innerHTML = "");

  // Process each image
  const imagePromises = data.map(item => {
      return new Promise((resolve, reject) => {
          const img = new Image();
          img.width = 128;
          img.height = 128;
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
      spinner.style.display = "none";
  }
}
  



  
// function to create json file from the images(excutes the shell script)- excutes when number button is clicked
export async function randomizeData(num, myClassifier, modelType) {
  if (!num) {
    console.error("Please enter a number");
    return;
  }
  
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
      loadData("/images/dataSets/sharks.json", myClassifier, modelType);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
