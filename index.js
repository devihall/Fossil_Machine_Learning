////////////////////////////////////////
function openTab(tabName) {
  // Hide all tabs
  var tabs = document.getElementsByClassName("tab");
  for (var i = 0; i < tabs.length; i++) {
    tabs[i].classList.remove("active");
  }

  // Deactivate all tab buttons
  var tabButtons = document.getElementsByClassName("tab-button");
  for (var i = 0; i < tabButtons.length; i++) {
    tabButtons[i].classList.remove("active");
  }

  // Show the selected tab
  document.getElementById(tabName).classList.add("active");

  // Activate the selected tab button
  document
    .querySelector("[onclick*='" + tabName + "']")
    .classList.add("active");
}

// logic for tabbed navigation
// function openTab(evt, tabName) {
//   var i, tabcontent, tablinks;
//   tabcontent = document.getElementsByClassName("tabcontent");
//   for (i = 0; i < tabcontent.length; i++) {
//     tabcontent[i].style.display = "none";
//   }
//   tablinks = document.getElementsByClassName("tab");
//   for (i = 0; i < tablinks.length; i++) {
//     tablinks[i].className = tablinks[i].className.replace(" active", "");
//   }
//   document.getElementById(tabName).style.display = "block";
//   evt.currentTarget.className += " active";
// }

// // Display the home tab by default
// document.getElementById("home").style.display = "block";

////////////////////////////////////
// // logic for model training

// Initialize the MobileNet model
let myimages = [];
let img;
let currentIndex = 0;
let allImages = [];
let predictions = [];

const myfeatureExtractor = ml5.featureExtractor("MobileNet", modelReady);
const myClassifier = myfeatureExtractor.classification();

console.log("myimages", myimages);

// Function to handle model loading
function modelReady() {
  console.log("Model is ready");
}

// Function to handle training files input
async function handleFileInput(inputId) {
  const input = document.getElementById(inputId);
  console.log("input", input);
  const promises = [];
  const thumbnailContainer = document.getElementById(
    "thumbnailContainer" + inputId[inputId.length - 1]
  );
  thumbnailContainer.innerHTML = ""; // Clear previous thumbnails

  // Retrieve the corresponding h4 element's text content using its id
  const h4TextContent = document.getElementById(
    "category" + inputId[inputId.length - 1]
  ).textContent;

  for (let i = 0; i < input.files.length; i++) {
    console.log("input.files", input.files);

    const file = input.files[i];

    // Create a new image element
    const img = document.createElement("img");
    img.width = 100; // Set width for display purposes
    img.height = 100; // Set height for display purposes

    img.src = URL.createObjectURL(file);
    console.log("FILE", file);

    const thumbnailDiv = document.createElement("div");
    thumbnailDiv.classList.add("thumbnail");
    thumbnailDiv.appendChild(img);
    thumbnailContainer.appendChild(thumbnailDiv);

    // add uploaded images to myimages array
    myimages.push(img);

    // Use the h4TextContent as the category
    let category = h4TextContent.trim();
    console.log("category", category);
    promises.push(myClassifier.addImage(img, category));
    console.log(
      "myClassifier.addImage(img, category)",
      myClassifier.addImage(img, category)
    );
  }
  await Promise.all(promises);
  myClassifier.train(whileTraining);
  console.log(
    "myClassifier.train(whileTraining)",
    myClassifier.train(whileTraining)
  );
}

// Function for printing loss
async function whileTraining(loss) {
  if (loss == null) {
    console.log("no loss");
  } else {
    console.log(loss);
  }
}

// logic for test image
///////////////////////////////////
function readURL(input) {
  console.log("choose image clicked");
  if (input.files && input.files[0]) {
    $("#classify").prop("disabled", false);
    var reader = new FileReader();

    reader.onload = function (e) {
      $("#image").attr("src", e.target.result);
    };

    reader.readAsDataURL(input.files[0]);
  }
}

/////////////////////////////////////////////////////
// logic for image classification with retrained model
function classify() {
  console.log("classify button clicked");
  $("#classify").prop("disabled", true);

  let img;

  const element = document.getElementById("result");
  console.log("element", element);

  element.innerHTML = "Detecting...";
  console.log("element.innerHTML", element.innerHTML);

  $("#result").addClass("border");

  // Initialize Image Classifier with MobileNet.
  img = document.getElementById("image");
  console.log("test image", img);
  myClassifier.classify(img, gotResult);
  console.log(
    "myClassifier.classify(img, gotResult)",
    myClassifier.classify(img, gotResult)
  );

  // Move the #result div below the "Choose Image" and "Classify" button
  const resultContainer = document.querySelector(".buttonList");
  resultContainer.parentNode.insertBefore(element, resultContainer.nextSibling);

  // Function to run when results arrive
  function gotResult(error, results) {
    console.log("in gotResult function");
    if (error) {
      console.log(error);
      element.innerHTML = error;
    } else {
      console.log(results);

      let num = results[0].confidence * 100;
      element.innerHTML =
        "<h5>" +
        results[0].label +
        "</h5> Confidence: <b>" +
        num.toFixed(2) +
        "%</b>";
    }
  }
}
