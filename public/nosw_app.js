import * as tf from '@tensorflow/tfjs-node';
import * as mobilenet from '@tensorflow-models/mobilenet';
import fs from 'fs';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const readFileAsync = promisify(fs.readFile);

const MOBILE_NET_INPUT_WIDTH = 224;
const MOBILE_NET_INPUT_HEIGHT = 224;
const CLASS_NAMES = [
    'carcharhinus_leucas', 'carcharodon_carcharias', 'galeocerdo_cuvier',
    'hemipristis_serra', 'isurus_hastalis', 'otodus_megalodon'
];

let model, featureExtractor;


async function loadMobileNetFeatureModel() {
  featureExtractor = await mobilenet.load({ version: 2, alpha: 0.75 });
  featureExtractor.trainable = true;
  console.log('MobileNet model loaded successfully!');
}

async function loadAndProcessImage(imagePath) {
  const imageBuffer = await readFileAsync(imagePath);
  const tfImage = tf.node.decodeImage(imageBuffer, 3);
  const resizedImage = tf.image.resizeBilinear(tfImage, [MOBILE_NET_INPUT_HEIGHT, MOBILE_NET_INPUT_WIDTH]);
  const normalizedImage = resizedImage.div(255.0).expandDims();
  return normalizedImage;
}

async function loadTrainingData() {
  const data = JSON.parse(await readFileAsync(path.join(__dirname, 'images', 'dataSets', 'sharks.json')));
  const imageFeatureVectors = [];
  const labels = [];

  for (const item of data) {
    const imagePath = path.join(__dirname, item.image);
    const image = await loadAndProcessImage(imagePath);
    const featureVector = featureExtractor.infer(image);
    imageFeatureVectors.push(featureVector);
    labels.push(CLASS_NAMES.indexOf(item.category));
  }

  const xs = tf.concat(imageFeatureVectors);
  const ys = tf.oneHot(tf.tensor1d(labels, 'int32'), CLASS_NAMES.length);
  return { xs, ys };
}

// Main training function and model architecture
async function loadAndTrain() {
  await loadMobileNetFeatureModel();

  model = tf.sequential();
  model.add(tf.layers.dense({ inputShape: [1000], units: 256, activation: 'relu' })); // Adjusted input shape to [1000]
  model.add(tf.layers.dense({ units: 128, activation: 'relu' }));
  model.add(tf.layers.dense({ units: CLASS_NAMES.length, activation: 'softmax' }));
  
  model.summary();

  const optimizer = tf.train.adam(0.0001); // Lower learning rate
  model.compile({
    optimizer: optimizer,
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy']
  });

  const { xs, ys } = await loadTrainingData();
  await model.fit(xs, ys, {
    epochs: 20,
    callbacks: {
      onEpochEnd: (epoch, log) => console.log(`Epoch ${epoch}: loss = ${log.loss}`)
    }
  });
}

async function classifyNewImage(imagePath) {
  const processedImage = await loadAndProcessImage(imagePath);
  const featureVector = featureExtractor.infer(processedImage);
  const predictions = model.predict(featureVector).softmax().dataSync();
  
  const results = CLASS_NAMES.map((className, index) => ({
    className,
    probability: predictions[index]
  }));
  results.forEach(result => console.log(`${result.className}: ${result.probability.toFixed(4)}`));

  return results;
}


// async function classifyNewImage(imagePath) {
//   const processedImage = await loadAndProcessImage(imagePath);
//   const featureVector = mobilenet.predict(processedImage);
//   const predictions = model.predict(featureVector).softmax().dataSync();

//   // Create a detailed prediction result with probabilities for each class
//   const results = CLASS_NAMES.map((className, index) => ({
//     className,
//     probability: predictions[index]
//   }));
//   results.forEach(result => console.log(`${result.className}: ${result.probability.toFixed(4)}`));

//   return results;
// }


async function main() {
  await loadAndTrain();
  console.log('Test Galeocerdo Cuvier image');
  await classifyNewImage('images/dataSets/sharks/galeocerdo_cuvier/VP UF-TRO8935 lingual copy.png');
  console.log('Test Carcharodon Carcharias image');
  await classifyNewImage('images/dataSets/sharks/carcharodon_carcharias/VP UF-TRO2367 lingual copy.png');
  console.log('Test Hemipristis Serra image');
  await classifyNewImage('images/dataSets/sharks/hemipristis_serra/VP UF-TRO 7575 lingual copy.png');
  console.log('Test Carcharhinus Leucas image');
  await classifyNewImage('images/dataSets/sharks/carcharhinus_leucas/VP UF64381E lingual copy.png');
  console.log('Test Otodus Megalodon image');
  await classifyNewImage('images/dataSets/sharks/otodus_megalodon/VP UF-TRO4486 lingual copy.png');
  console.log('Test Isurus Hastalis image');
  await classifyNewImage('images/dataSets/sharks/isurus_hastalis/VP UF-TRO7321 lingual copy.png');

}


main().catch(console.error);
