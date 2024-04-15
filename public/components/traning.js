import { lostDataVisualization } from "./performance.js";

// Function to train model
export async function trainModel(myClassifier) {

  const trainingOptions = {
    epochs: 20,
    batchSize: 12,
  };

  const results = await myClassifier.train(trainingOptions, whileTraining, finishedTraining);
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

  function finishedTraining() {
    console.log('finished training');
    return myClassifier;
    // method 1: you can pass in an object with a matching key and the p5 image
    // cnn.classify({ image: testA }, gotResults);
  }
  
  // Plot the loss data in the Performance tab

  function gotResults(err, results) {
    if (err) {
      console.log(err);
      return;
    }
    lostDataVisualization(results);
    console.log('results', results);
    const percent = 100 * results[0].confidence;
    createP(`${results[0].label} ${nf(percent, 2, 1)}%`);
  }

}

// function to call when model is training
export async function whileTraining(epoch, loss) {
  console.log("model is training");
  //////
  console.log(`Epoch: ${epoch}, Loss: ${loss}`);
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
