export async function initModel(categories) {
  const options = {
    inputs: [16, 16, 3],
    task: 'imageClassification',
    debug: true
  };

  const neuralNetwork = ml5.neuralNetwork(options, function () {
    console.log("Model is ready");
  });

  return neuralNetwork;
}

// function to reset the model
export async function resetModel(myClassifier, trainingResults) {
  trainingResults = null;
  // Check if myClassifier exists and has a clear method
  if (myClassifier && myClassifier.clear) {
    myClassifier.clear();
    console.log("Classifier data cleared.");
  }

  // Reset the UI elements- clear image containers and print "reset" message to UI
  const thumbnailContainers = document.querySelectorAll(".thumbnailContainer");
  thumbnailContainers.forEach((container) => {
    container.innerHTML = "";
  });
  const trainingMessageContainer = document.getElementById("trainingMessage");
  trainingMessageContainer.innerHTML = "";

  console.log("Model and UI have been reset.");
}
