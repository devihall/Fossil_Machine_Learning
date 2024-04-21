import tf from '@tensorflow/tfjs-node';
import fs from 'fs';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';

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
    const model = tf.sequential();
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

async function main() {
    const { xs, ys } = await loadTrainingData();
    const model = defineModel();
    await model.fit(xs, ys, {
        epochs: 20,
        batchSize: 32,
        validationSplit: 0.2
    });
    console.log('Model trained successfully!');
}

main().catch(console.error);
