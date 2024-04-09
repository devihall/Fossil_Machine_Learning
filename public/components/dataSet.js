// Function to MANUALLY add training image files to model
export async function handleFileInput(inputId) {
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
