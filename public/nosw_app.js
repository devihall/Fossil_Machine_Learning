import tf from '@tensorflow/tfjs-node';
import fs from 'fs';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';
let model, mobilenet;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const readFileAsync = promisify(fs.readFile);

// Constants for model
const MOBILE_NET_INPUT_WIDTH = 224;
const MOBILE_NET_INPUT_HEIGHT = 224;
const CLASS_NAMES = [
    'carcharhinus_leucas',
    'carcharodon_carcharias', 
    'galeocerdo_cuvier',
    'hemipristis_serra',
    'isurus_hastalis',
    'otodus_megalodon'
];


// Load the MobileNet model and warm it up
async function loadMobileNetFeatureModel() {
  const URL = 'https://www.kaggle.com/models/google/mobilenet-v3/TfJs/large-075-224-classification/1';
  mobilenet = await tf.loadGraphModel(URL, {fromTFHub: true});
  console.log('MobileNet v3 loaded successfully!');
  
  // Warm up the model
  tf.tidy(() => {
    const warmupResult = mobilenet.predict(tf.zeros([1, MOBILE_NET_INPUT_HEIGHT, MOBILE_NET_INPUT_WIDTH, 3]));
    console.log('Warm-up result shape:', warmupResult.shape);
  });
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
    const featureVector = mobilenet.predict(image);  // Extract features using MobileNet
    imageFeatureVectors.push(featureVector);
    labels.push(CLASS_NAMES.indexOf(item.category));
  }

  const xs = tf.concat(imageFeatureVectors); // Concatenate all feature vectors
  const ys = tf.oneHot(tf.tensor1d(labels, 'int32'), CLASS_NAMES.length);

  return { xs, ys };
}

// Main function to load model and train
async function loadAndTrain() {
  await loadMobileNetFeatureModel();

  model = tf.sequential();
  model.add(tf.layers.dense({ inputShape: [1001], units: 256, activation: 'relu' }));
  // model.add(tf.layers.dropout(0.5));  
  model.add(tf.layers.dense({ units: 128, activation: 'relu' }));
  model.add(tf.layers.dense({ units: CLASS_NAMES.length, activation: 'softmax' }));
  model.summary();

  model.compile({
    optimizer: 'adam',
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
  const featureVector = mobilenet.predict(processedImage);
  const predictions = model.predict(featureVector).softmax().dataSync();

  // Create a detailed prediction result with probabilities for each class
  const results = CLASS_NAMES.map((className, index) => ({
    className,
    probability: predictions[index]
  }));
  results.forEach(result => console.log(`${result.className}: ${result.probability.toFixed(4)}`));

  return results;
}


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

