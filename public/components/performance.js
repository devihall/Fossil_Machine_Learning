/////////
// visualize accuracy
export function plotAccuracy( results) {
  // Initialize an array to store loss values
  let lossData = [];
  let trainingResults;
  let loss;
  let epoch;
  let surface;
  let jsonResponse = [];
  let categoryCount = 0;
  let classificationResults;
  
  console.log("Plotting accuracy...");

  console.log("hello world");
  console.log(">>RESUKTS", results);

  const epochs = accuracyData.map((data) => data.epoch);
  const accuracies = accuracyData.map((data) => data.accuracy);
  console.log("epochs plotacc", epochs);
  console.log("accuracy plotacc", accuracies);
}
