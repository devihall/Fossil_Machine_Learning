// Copyright (c) 2019 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT


/* ===
ml5 Example
Image classification using Convolutional Neural Network
This example uses a callback pattern to create the classifier
=== */

// const modelDetails = {
//   model: './model.json',
// }


let nn;
const IMAGE_WIDTH = 128;
const IMAGE_HEIGHT = 128;
const IMAGE_CHANNELS = 4;

const images = [];
let testA;

function preload() {
  for (let index = 1; index < 2; index++) {
    images.push({ label: "carcharhinus_leucas", image: loadImage(`images/dataSets/sharks/carcharhinus_leucas/VP UF122563B lingual copy.png`)});
    images.push({ label: "carcharhinus_leucas", image: loadImage(`images/dataSets/sharks/carcharhinus_leucas/VP UF122563D lingual copy.png`)});
    images.push({ label: "carcharhinus_leucas", image: loadImage(`images/dataSets/sharks/carcharhinus_leucas/VP UF122563E lingual copy.png`)});
    images.push({ label: "carcharhinus_leucas", image: loadImage(`images/dataSets/sharks/carcharhinus_leucas/VP UF122794 lingual copy.png`)});
    images.push({ label: "carcharhinus_leucas", image: loadImage(`images/dataSets/sharks/carcharhinus_leucas/VP UF122910A lingual copy.png`)});
  
  
    images.push({ label: "carcharodon_carcharias", image: loadImage(`images/dataSets/sharks/carcharodon_carcharias/VP UF-TRO2366 lingual copy.png`)});
    images.push({ label: "carcharodon_carcharias", image: loadImage(`images/dataSets/sharks/carcharodon_carcharias/VP UF-TRO2367 lingual copy.png`)});
    images.push({ label: "carcharodon_carcharias", image: loadImage(`images/dataSets/sharks/carcharodon_carcharias/VP UF-TRO2368 lingual copy.png`)});
    images.push({ label: "carcharodon_carcharias", image: loadImage(`images/dataSets/sharks/carcharodon_carcharias/VP UF-TRO2369 lingual copy.png`)});
    images.push({ label: "carcharodon_carcharias", image: loadImage(`images/dataSets/sharks/carcharodon_carcharias/VP UF-TRO2371 lingual copy.png`)});
  
  
    images.push({ label: "galeocerdo_cuvier", image: loadImage(`images/dataSets/sharks/galeocerdo_cuvier/VP UF-TRO8045 lingual copy.png`)});
    images.push({ label: "galeocerdo_cuvier", image: loadImage(`images/dataSets/sharks/galeocerdo_cuvier/VP UF-TRO8939 lingual copy.png`)});
    images.push({ label: "galeocerdo_cuvier", image: loadImage(`images/dataSets/sharks/galeocerdo_cuvier/VP UF-TRO8941 lingual copy.png`)});
    images.push({ label: "galeocerdo_cuvier", image: loadImage(`images/dataSets/sharks/galeocerdo_cuvier/VP UF-TRO8943 lingual copy.png`)});
    images.push({ label: "galeocerdo_cuvier", image: loadImage(`images/dataSets/sharks/galeocerdo_cuvier/VP UF-TRO8948 lingual copy.png`)});
  
  
    images.push({ label: "hemipristis_serra", image: loadImage(`images/dataSets/sharks/hemipristis_serra/VP UF 229824 lingual copy.png`)});
    images.push({ label: "hemipristis_serra", image: loadImage(`images/dataSets/sharks/hemipristis_serra/VP UF-TRO 7540 lingual copy.png`)});
    images.push({ label: "hemipristis_serra", image: loadImage(`images/dataSets/sharks/hemipristis_serra/VP UF-TRO 7575 lingual copy.png`)});
    images.push({ label: "hemipristis_serra", image: loadImage(`images/dataSets/sharks/hemipristis_serra/VP UF-TRO 7576 lingual copy.png`)});
    images.push({ label: "hemipristis_serra", image: loadImage(`images/dataSets/sharks/hemipristis_serra/VP UF-TRO 7579  lingual copy.png`)});
  
    
    images.push({ label: "isurus_hastalis", image: loadImage(`images/dataSets/sharks/isurus_hastalis/VP UF-TRO3913 lingual copy.png`)});
    images.push({ label: "isurus_hastalis", image: loadImage(`images/dataSets/sharks/isurus_hastalis/VP UF-TRO5637 lingual copy.png`)});
    images.push({ label: "isurus_hastalis", image: loadImage(`images/dataSets/sharks/isurus_hastalis/VP UF-TRO7125 lingual copy.png`)});
    images.push({ label: "isurus_hastalis", image: loadImage(`images/dataSets/sharks/isurus_hastalis/VP UF-TRO7127 lingual copy.png`)});
    images.push({ label: "isurus_hastalis", image: loadImage(`images/dataSets/sharks/isurus_hastalis/VP UF-TRO7128 lingual copy.png`)});
  
  
    images.push({ label: "otodus_megalodon", image: loadImage(`images/dataSets/sharks/otodus_megalodon/VP GS1381 lingual copy.png`)});
    images.push({ label: "otodus_megalodon", image: loadImage(`images/dataSets/sharks/otodus_megalodon/VP UF-TRO2735 lingual copy.png`)});
    images.push({ label: "otodus_megalodon", image: loadImage(`images/dataSets/sharks/otodus_megalodon/VP UF-TRO2755 lingual copy.png`)});
    images.push({ label: "otodus_megalodon", image: loadImage(`images/dataSets/sharks/otodus_megalodon/VP UF-TRO4484 lingual copy.png`)});
    images.push({ label: "otodus_megalodon", image: loadImage(`images/dataSets/sharks/otodus_megalodon/VP UF-TRO4485 lingual copy.png`)});
  
    
  }
 
  testA = loadImage(`images/dataSets/sharks/carcharhinus_leucas/VP UF122563D lingual copy.png`);
}


async function loadModel() {
  try {
      const model = await tf.loadLayersModel('model.json');
      console.log('Model loaded successfully', model);
      return model
  } catch (error) {
      console.error('Failed to load the model:', error);
  }
}



function setup() {
  createCanvas(256, 256);
  image(testA, 0, 0, width, height);

  const options = {
    inputs: [IMAGE_WIDTH, IMAGE_HEIGHT, IMAGE_CHANNELS],
    task: 'imageClassification',
    debug: true,
  };

  // construct the neural network
  nn = ml5.neuralNetwork(options);
  // nn.load('./model.json', modelLoaded);

  function modelLoaded() {
    console.log('model loaded');
  }

  // add data
  for (let i = 0; i < images.length; i += 1) {
    nn.addData({ image: images[i].image }, { label: images[i].label });
  }

  // normalize data
  nn.normalizeData();

  nn.train({ epochs: 20, batchSize: 12 }, finishedTraining);
}

function finishedTraining() {
  console.log('finished training');
  // method 1: you can pass in an object with a matching key and the p5 image
  nn.classify({ image: testA }, gotResults);
}

function gotResults(err, results) {
  if (err) {
    console.log(err);
    return;
  }
  console.log(results);
  const percent = 100 * results[0].confidence;
  createP(`${results[0].label} ${nf(percent, 2, 1)}%`);
}
