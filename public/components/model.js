export function initModel(categories) {

  /////////logic for Feature Extraction & model re-training//////////

  // Initialize the MobileNet model
  let myimages = [];
  let img;
  let currentIndex = 0;
  let allImages = [];
  let predictions = [];


  const myfeatureExtractor = ml5.featureExtractor("MobileNet", modelReady);
  let myClassifier = myfeatureExtractor.classification(myimages, {
  numLabels: categories.length,
  });

  console.log("myimages", myimages);

  // Function to handle model loading
  function modelReady() {
  console.log("Model is ready");
  }

  // initialize Feature Extractor & Classifier
  const featureExtractor = ml5.featureExtractor("MobileNet", modelReady);
  myClassifier = featureExtractor.classification(myimages, {
      numLabels: categoryCount,
  });

  return myClassifier;

}