/////////
// visualize accuracy
export function plotAccuracy( results ) {

  console.log("Plotting accuracy...", results);

  // const epochs = accuracyData.map((data) => data.epoch);
  // const accuracies = accuracyData.map((data) => data.accuracy);
  // console.log("epochs plotacc", epochs);
  // console.log("accuracy plotacc", accuracies);
}


export function lostDataVisualization( results ) {
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
}