import tf from '@tensorflow/tfjs-node';
import fs from 'fs';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';
let model, detectionModel;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const readFileAsync = promisify(fs.readFile);


const CLASS_NAMES = [
    'carcharhinus_leucas',
    'carcharodon_carcharias', 
    'galeocerdo_cuvier',
    'hemipristis_serra',
    'isurus_hastalis',
    'otodus_megalodon'
];

async function loadDetectionModel() {
    const modelUrl = `file://${path.join(__dirname, 'model/model.json')}`;
    detectionModel = await tf.loadGraphModel(modelUrl);
    console.log('Detection model loaded successfully!');
}

async function loadAndProcessImage(imagePath) {
  const imageBuffer = await readFileAsync(imagePath);
  const tfImage = tf.node.decodeImage(imageBuffer, 3);
  console.log("Decoded image shape:", tfImage.shape);  // Debug output

  const resizedImage = tf.image.resizeBilinear(tfImage, [640, 640]);
  console.log("Resized image shape:", resizedImage.shape);  // Debug output

  const normalizedImage = resizedImage.div(tf.scalar(255.0)).expandDims();
  console.log("Normalized image shape:", normalizedImage.shape);  // Debug output
  const castedImage = normalizedImage.cast('int32');  // Ensure the tensor is cast to int32
  console.log("castedImage image shape:", castedImage.shape);  // Debug output

  return castedImage;
}

async function extractFeatures(processedImage) {
    const predictions = await detectionModel.executeAsync(processedImage);
    // This part might need to adjust based on what tensor you wish to use as features.
    return predictions[0]; // Simplified assumption, usually index 0 is not features.
}

async function loadTrainingData() {
    const data = JSON.parse(await readFileAsync(path.join(__dirname, 'images', 'dataSets', 'sharks.json')));
    const imageFeatureVectors = [];
    const labels = [];

    for (const item of data) {
        const imagePath = path.join(__dirname, item.image);
        const processedImage = await loadAndProcessImage(imagePath);
        const featureVector = await extractFeatures(processedImage);
        imageFeatureVectors.push(featureVector);
        labels.push(CLASS_NAMES.indexOf(item.category));
    }

    const xs = tf.stack(imageFeatureVectors);
    const ys = tf.oneHot(tf.tensor1d(labels, 'int32'), CLASS_NAMES.length);
    console.log("Training data shape:", xs.shape, ys.shape);  // Debug output

    return { xs, ys };
}

async function loadAndTrain() {
    await loadDetectionModel();

    model = tf.sequential();
    model.add(tf.layers.flatten({inputShape: [640, 640, 3]}));  // Added inputShape here
    model.add(tf.layers.dense({units: 128, activation: 'relu'})); // Removed inputShape
    model.add(tf.layers.dense({units: CLASS_NAMES.length, activation: 'softmax'}));
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
    const predictions = await detectionModel.executeAsync({'input_tensor': processedImage});
    console.log(predictions);

    // const results = CLASS_NAMES.map((className, index) => ({
    //     className,
    //     probability: predictions[index].toFixed(4)
    // }));
    // results.forEach(result => console.log(`${result.className}: ${result.probability}`));

    // return results;
}

async function main() {
    await loadAndTrain();
    // await classifyNewImage('images/dataSets/tests/carcharhinus_leucas1.png');
}

main().catch(console.error);
