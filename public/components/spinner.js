export function showSpinner(message = "Loading...") {
  const spinner = document.getElementById("rectangle-spinner");
  console.log('S:INNEewrewrewewrwerwwe', spinner);
  if (spinner) {
    const messageElement = spinner.querySelector('.spinner-message');
    if (messageElement) {
      messageElement.textContent = message; // Set the text content to the passed message
    }
    spinner.style.display = "flex";
  }
}

export function hideSpinner() {
  const spinner = document.getElementById("rectangle-spinner");
  if (spinner) {
    spinner.style.display = "none";
  }
}