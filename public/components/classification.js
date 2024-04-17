import { categoryNames } from "./categories.js";
import { plotAccuracy } from "./performance.js";

///////// logic for classifying single test image//////
export function readURL(input) {
  console.log("choose image clicked");
  // input test image for classification
  if (input.files && input.files[0]) {
    $("#classify").prop("disabled", false);
    var reader = new FileReader();

    reader.onload = function (e) {
      $("#image").attr("src", e.target.result);
    };

    reader.readAsDataURL(input.files[0]);
  }
}

// logic for image classification with retrained model
export async function classify(myClassifier, modelType, width, height) {
  console.log("classify button clicked");
  $("#classify").prop("disabled", true);

  const element = $("#result");
  // print "Detecting..." message to the UI
  element.html("Detecting...").addClass("border");

  // Clear the content of the result div
  element.empty();
  
  if (modelType === 'FE') {
    const img = document.getElementById("image");

    // Ask Image Classifier to classify test image
    myClassifier.classify(img, gotResult);
  } else {
    const item = document.getElementById("image");
    const img = new Image();
    img.width = width;
    img.height = height;
    img.src = item.src;
    // Ask Image Classifier to classify test image
    myClassifier.classify({ image: img }, gotResult);
  }

  // Move the #result div below the "Choose Image" and "Classify" button
  const resultContainer = $(".buttonList");
  const existingElement = $(".result-container");
  if (existingElement.length === 0) {
    resultContainer.after(
      '<div class="result-container p-2 mt-3" style="width: 300px;"></div>'
    );
  }
  resultContainer.parent().find(".result-container").html(element);


  // Function to run when classification results arrive
  async function gotResult(error, classificationResults) {
    console.log("in gotResult function");

    const categories = await categoryNames();
    
    if (error) {
      console.log(error);
      // if images are not added for classification, print error message to UI
      const errorMessage = $(
        "<div class='alert alert-danger alert-dismissible fade show' role='alert'>" +
          "Train the model before using the classifier" +
          "<button type='button' class='btn-close' data-bs-dismiss='alert' aria-label='Close'></button>" +
          "</div>"
      );
      // add "classifier not ready" message to classification Results container
      $("#classifierMessage").append(errorMessage);
      element.html("classifier not ready!");
      setTimeout(() => {
        errorMessage.remove();
        element.remove();
      }, 3000); // Remove after 5 seconds (adjust as needed
    } else {
      console.log("classification results", classificationResults);

      // ///////////////
      plotAccuracy(classificationResults);
      // ///////////////

      // print label and confidence to screen
      let num = classificationResults[0].confidence * 100;
      const categoryID = classificationResults[0].label;
      const categoryName = categories[categoryID] || "Unknown Category";

      console.log("categoryname", categoryName);
      // console.log("categoryID", categoryID);

      // Extract predicted label and confidence score
      const predictedLabel = classificationResults[0].label;
      const confidence = classificationResults[0].confidence;

      // Here, you need to find the true label for the test image
      // const trueLabel = findTrueLabel(classificationResults[0].image); // Replace classificationResults[0].image with the identifier used to find the true label
      const trueLabel = classificationResults[0].label;
      // Push the predicted label to an array of predictions
      const predictions = [predictedLabel];

      // Push the true label to an array of true labels
      const trueLabels = [trueLabel];

      // /////////////////
      // Function to calculate accuracy
      function calculateAccuracy(predictions, trueLabels) {
        if (predictions.length !== trueLabels.length) {
          console.error(
            "Length of predictions and true labels arrays must be equal."
          );
          return null;
        }

        const totalExamples = predictions.length;
        let correctPredictions = 0;

        for (let i = 0; i < totalExamples; i++) {
          if (predictions[i] === trueLabels[i]) {
            correctPredictions++;
          }
        }

        return correctPredictions / totalExamples;
      }

      // Calculate accuracy
      const accuracy = calculateAccuracy(predictions, trueLabels);
      console.log("Accuracy:", accuracy);

      plotAccuracy(classificationResults);

      element.html(
        "<h5>" +
          categoryName +
          "</h5> Confidence: <b>" +
          num.toFixed(2) +
          "%</b>"
      );
    }
  }
}
