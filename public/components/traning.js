let trainingResults;



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
export async function whileTraining(epoch, loss) {
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
  
