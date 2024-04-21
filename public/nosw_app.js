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
  const URL = 'https://tfhub.dev/google/tfjs-model/imagenet/mobilenet_v3_small_100_224/feature_vector/5/default/1';
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

  model = tf.sequential(); // Initialize model in the higher scope
  model.add(tf.layers.dense({ inputShape: [1024], units: 128, activation: 'relu' }));
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
  await classifyNewImage('images/dataSets/tests/carcharhinus_leucas1.png');

}


main().catch(console.error);

