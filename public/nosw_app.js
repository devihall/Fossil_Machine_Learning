import tf from '@tensorflow/tfjs-node';
import fs from 'fs';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const readFileAsync = promisify(fs.readFile);

let model = null;

const CLASS_NAMES = [
    'carcharhinus_leucas',
    'carcharodon_carcharias', 
    'galeocerdo_cuvier',
    'hemipristis_serra',
    'isurus_hastalis',
    'otodus_megalodon'
];

async function loadAndProcessImage(imagePath) {
  const imageBuffer = await readFileAsync(imagePath);
  const tfImage = tf.node.decodeImage(imageBuffer, 3); // Correctly defining tfImage here
  const resizedImage = tf.image.resizeBilinear(tfImage, [224, 224]); // Use the defined tfImage
  const normalizedImage = resizedImage.div(255.0); // Normalizing the resized image
  return normalizedImage; // Return the normalized image directly
}

async function loadTrainingData() {
    const data = JSON.parse(await readFileAsync(path.join(__dirname, 'images', 'dataSets', 'sharks.json')));
    const images = [];
    const labels = [];

    for (const item of data) {
        const imagePath = path.join(__dirname, item.image);
        const image = await loadAndProcessImage(imagePath);
        images.push(image); // Add the normalized image to the array
        labels.push(CLASS_NAMES.indexOf(item.category));
    }

    const xs = tf.stack(images); // Stack the images directly here
    const ys = tf.oneHot(tf.tensor1d(labels, 'int32'), CLASS_NAMES.length);
    return { xs, ys };
}

function defineModel() {
    model = tf.sequential();
    model.add(tf.layers.conv2d({
        inputShape: [224, 224, 3],
        filters: 32,
        kernelSize: 3,
        activation: 'relu'
    }));
    model.add(tf.layers.maxPooling2d({poolSize: 2}));
    model.add(tf.layers.conv2d({
        filters: 64,
        kernelSize: 3,
        activation: 'relu'
    }));
    model.add(tf.layers.maxPooling2d({poolSize: 2}));
    model.add(tf.layers.flatten());
    model.add(tf.layers.dense({
        units: 128,
        activation: 'relu'
    }));
    model.add(tf.layers.dense({
        units: CLASS_NAMES.length,
        activation: 'softmax'
    }));
    model.compile({
        optimizer: 'adam',
        loss: 'categoricalCrossentropy',
        metrics: ['accuracy']
    });
    return model;
}

async function loadAndTrain() {
    const { xs, ys } = await loadTrainingData();
    const model = defineModel();
    await model.fit(xs, ys, {
        epochs: 20,
        batchSize: 32,
        validationSplit: 0.2
    });
    console.log('Model trained successfully!');
}


async function classifyNewImage(imagePath) {
  const image = await loadAndProcessImage(imagePath);
  const prediction = model.predict(image.expandDims()); // Ensure the image has the batch dimension
  const probabilities = prediction.dataSync();
  const results = CLASS_NAMES.map((className, index) => ({
      className,
      probability: probabilities[index].toFixed(4)
  }));
  results.forEach(result => console.log(`${result.className}: ${result.probability}`));
  return results;
}



async function main() {
  await loadAndTrain();
  console.log('>>> Test Galeocerdo Cuvier image <<<');
  await classifyNewImage('images/dataSets/sharks/galeocerdo_cuvier/VP UF-TRO8935 lingual copy.png');
  console.log('');
  console.log('>>> Test Carcharodon Carcharias image <<<');
  await classifyNewImage('images/dataSets/sharks/carcharodon_carcharias/VP UF-TRO2367 lingual copy.png');
  console.log('');
  console.log('>>> Test Hemipristis Serra image <<<');
  await classifyNewImage('images/dataSets/sharks/hemipristis_serra/VP UF-TRO 7575 lingual copy.png');
  console.log('');
  console.log('>>> Test Carcharhinus Leucas image <<<');
  await classifyNewImage('images/dataSets/sharks/carcharhinus_leucas/VP UF64381E lingual copy.png');
  console.log('');
  console.log('>>> Test Otodus Megalodon image <<<');
  await classifyNewImage('images/dataSets/sharks/otodus_megalodon/VP UF-TRO4486 lingual copy.png');
  console.log('');
  console.log('>>> Test Isurus Hastalis image <<<');
  await classifyNewImage('images/dataSets/sharks/isurus_hastalis/VP UF-TRO7321 lingual copy.png');

}


main().catch(console.error);
