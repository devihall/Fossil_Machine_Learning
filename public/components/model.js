import { loadCategories } from "./categories.js";

export async function initModelFE() {
  const categories = await loadCategories('json', 'training')
  return new Promise((resolve, reject) => {
    
    // Initialize the MobileNet model
    const myfeatureExtractor = ml5.featureExtractor("MobileNet", modelReady);

    let myClassifier = myfeatureExtractor.classification([], { numLabels: categories.length });

    // Function to handle model loading
    function modelReady() {
      console.log("Model FE is ready");
      resolve(myClassifier);
    }

  });
}



export async function initModelCNN(width, height, channels) {
 const options = {
   inputs: [width, height, channels],
   task: "imageClassification",
   debug: true,
 };

  const neuralNetwork = ml5.neuralNetwork(options);

  const modelDetails = {
    model: "model/model.json",
    metadata: "model/model_meta.json",
    weights: "model/weights.bin",
  };
  neuralNetwork.load(modelDetails);

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
