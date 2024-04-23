import tf from "@tensorflow/tfjs-node";
import fs from "fs";
import { promisify } from "util";
import path from "path";
import { fileURLToPath } from "url";

let mobilenet;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const readFileAsync = promisify(fs.readFile);

// Constants for model
const MOBILE_NET_INPUT_WIDTH = 224;
const MOBILE_NET_INPUT_HEIGHT = 224;
const CLASS_NAMES = [
  "carcharhinus_leucas",
  "carcharodon_carcharias",
  "galeocerdo_cuvier",
  "hemipristis_serra",
  "isurus_hastalis",
  "otodus_megalodon",
];

// Load the MobileNet model and warm it up
async function loadMobileNetFeatureModel() {
  const URL =
    "https://tfhub.dev/google/tfjs-model/imagenet/mobilenet_v3_small_100_224/feature_vector/5/default/1";
  mobilenet = await tf.loadGraphModel(URL, { fromTFHub: true });
  console.log("MobileNet v3 loaded successfully!");
}

async function determineMobileNetOutputShape() {
  const inputImage = tf.zeros([
    1,
    MOBILE_NET_INPUT_HEIGHT,
    MOBILE_NET_INPUT_WIDTH,
    3,
  ]); // Create a dummy input image
  const output = mobilenet.predict(inputImage); // Pass the input image through MobileNet
  const outputShape = output.shape.slice(1); // Get the shape of the output tensor excluding the batch dimension
  console.log("MobileNet output shape:", outputShape); // Print the output shape
  return outputShape;
}

async function loadAndProcessImage(imagePath) {
  const imageBuffer = await readFileAsync(imagePath);
  const tfImage = tf.node.decodeImage(imageBuffer, 3);
  const resizedImage = tf.image.resizeBilinear(tfImage, [
    MOBILE_NET_INPUT_HEIGHT,
    MOBILE_NET_INPUT_WIDTH,
  ]);
  const normalizedImage = resizedImage.div(255.0).expandDims();
  return normalizedImage;
}

async function classifyNewImage(imagePath) {
  const processedImage = await loadAndProcessImage(imagePath);
  const featureVector = mobilenet.predict(processedImage);
  const predictions = featureVector.softmax().dataSync();

  // Create a detailed prediction result with probabilities for each class
  const results = CLASS_NAMES.map((className, index) => ({
    className,
    probability: predictions[index],
  }));
  results.forEach((result) =>
    console.log(`${result.className}: ${result.probability.toFixed(4)}`)
  );

  return results;
}

async function loadTrainingData() {
  const data = JSON.parse(
    await readFileAsync(
      path.join(__dirname, "images", "dataSets", "sharks.json")
    )
  );
  const imageFeatureVectors = [];
  const labels = [];

  for (const item of data) {
    const imagePath = path.join(__dirname, item.image);
    const image = await loadAndProcessImage(imagePath);
    const featureVector = mobilenet.predict(image); // Extract features using MobileNet
    imageFeatureVectors.push(featureVector);
    labels.push(CLASS_NAMES.indexOf(item.category));
  }

  const xs = tf.concat(imageFeatureVectors); // Concatenate all feature vectors
  const ys = tf.oneHot(tf.tensor1d(labels, "int32"), CLASS_NAMES.length);

  return { xs, ys };
}

async function trainModel() {
  // Load training data
  const { xs, ys } = await loadTrainingData();

  // Determine the output shape of the MobileNet model
  const mobileNetOutputShape = await determineMobileNetOutputShape();

  // Define model architecture
  const model = tf.sequential();
  // Add flatten layer with correct input shape
  model.add(tf.layers.flatten({ inputShape: mobileNetOutputShape }));
  model.add(tf.layers.dense({ units: 128, activation: "relu" }));
  model.add(
    tf.layers.dense({ units: CLASS_NAMES.length, activation: "softmax" })
  );

  // Compile model
  model.compile({
    optimizer: "adam",
    loss: "categoricalCrossentropy",
    metrics: ["accuracy"],
  });

  // Train model
  await model.fit(xs, ys, {
    epochs: 20,
    callbacks: {
      onEpochEnd: (epoch, log) =>
        console.log(`Epoch ${epoch}: loss = ${log.loss}`),
    },
  });
}

async function main() {
  await loadMobileNetFeatureModel();

  console.log("Training model...");
  await trainModel();

  console.log("Testing images...");
  console.log("Test Galeocerdo Cuvier image");
  await classifyNewImage(
    path.join(
      __dirname,
      "images/dataSets/sharks/galeocerdo_cuvier/VP UF-TRO11023 lingual copy.png"
    )
  );
  console.log("Test Carcharodon Carcharias image");
  await classifyNewImage(
    path.join(
      __dirname,
      "images/dataSets/sharks/carcharodon_carcharias/VP UF234842AE lingual copy.png"
    )
  );
  console.log("Test Hemipristis Serra image");
  await classifyNewImage(
    path.join(
      __dirname,
      "images/dataSets/sharks/hemipristis_serra/VP UF-TRO12972 lingual copy.png"
    )
  );
  console.log("Test Carcharhinus Leucas image");
  await classifyNewImage(
    path.join(
      __dirname,
      "images/dataSets/sharks/carcharhinus_leucas/VP UF122563D lingual copy.png"
    )
  );
  console.log("Test Otodus Megalodon image");
  await classifyNewImage(
    path.join(
      __dirname,
      "images/dataSets/sharks/otodus_megalodon/VP UF-TRO5281 lingual copy.png"
    )
  );
  console.log("Test Isurus Hastalis image");
  await classifyNewImage(
    path.join(
      __dirname,
      "images/dataSets/sharks/isurus_hastalis/VP UF234826 lingual copy.png"
    )
  );
}

main().catch(console.error);
