// loading image data from newly created JSON file
export async function loadImagesFromJson() {
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