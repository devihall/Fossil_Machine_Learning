let trainingResults;


// function to create json file from the images(excutes the shell script)- excutes when number button is clicked
export function executeShellScript(num) {
  
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

// Function to train model
export async function trainModel() {
  
    // ask model to train with the new data
    myClassifier
      .train(whileTraining)
      .then((results) => {
        console.log("Training complete", results);
        // const trainresults =  results;
        // plotAccuracy(categories);
  
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
  
        // get container for graph
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

// function to call when model is training
async function whileTraining(epoch, loss) {
    console.log("model is training");
    //////
    console.log(`Epoch: ${epoch}, Loss: ${loss}`);
    //// Calculate accuracy (this is just a placeholder, replace it with actual accuracy calculation)
    const accuracy = 1 - loss;
    accuracyData.push({ epoch, accuracy });
    //////
  
    // Display "Model is training" message
    const trainingMessageContainer = document.getElementById("trainingMessage");
    trainingMessageContainer.innerHTML = `
          <div class="alert alert-info" role="alert">
              Model is training...
          </div>`;
}
  
// function to reset the model
export async function resetModel() {
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
