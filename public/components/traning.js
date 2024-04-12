import { lostDataVisualization } from "./performance.js";

// Function to train model
export async function trainModel(cnn) {

  const trainingOptions = {
    epochs: 32,
    batchSize: 12,
  };

  cnn.train( trainingOptions,  whileTraining, finishedTraining)
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
      
      // Plot the loss data in the Performance tab
      lostDataVisualization(results);


    })

    function finishedTraining() {
      console.log("Training finished");
      classify(); // Once training is finished, proceed with classification
    }
  }

// function to call when model is training
export async function whileTraining(epoch, loss) {
  console.log("model is training");
  //////
  // console.log(`Epoch: ${epoch}, Loss: ${loss}`);
  //// Calculate accuracy (this is just a placeholder, replace it with actual accuracy calculation)
  const accuracy = 1 - loss;
  let accuracyData = [];

  accuracyData.push({ epoch, accuracy });
  //////

  // Display "Model is training" message
  const trainingMessageContainer = document.getElementById("trainingMessage");
  trainingMessageContainer.innerHTML = `
        <div class="alert alert-info" role="alert">
            Model is training...
        </div>`;
}