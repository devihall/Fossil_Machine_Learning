import { var1 } from './fossilML.mjs';
console.log('var1:', var1);
 async function plotConfusionMatrix(container, trueLabels, predictions, numClasses) {
    console.log('Plotting confusion matrix...', trueLabels);
    const labelsTensor = tf.tensor1d(trueLabels, 'int32');
    const predictionsTensor = tf.tensor1d(predictions, 'int32');

    // Calculate the confusion matrix
    const confMatrix = await tf.math.confusionMatrix(labelsTensor, predictionsTensor, numClasses);

    // Use tfjs-vis to render the confusion matrix
    const surface = { name: 'Confusion Matrix', tab: 'Charts', styles: { height: '640px' } };
    tfvis.render.confusionMatrix({name: 'Confusion Matrix', tab: 'Charts'}, { values: await confMatrix.array() }, container);
}

