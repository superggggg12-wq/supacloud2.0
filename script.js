const URL = "./my_model/";

let model, webcam, labelContainer, maxPredictions;

async function init() {
  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";

  // load model
  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();

  // setup webcam
  const flip = true;
  webcam = new tmImage.Webcam(250, 250, flip);
  await webcam.setup();
  await webcam.play();
  window.requestAnimationFrame(loop);

  document.getElementById("webcam-container").innerHTML = "";
  document.getElementById("webcam-container").appendChild(webcam.canvas);

  labelContainer = document.getElementById("label-container");
  labelContainer.innerHTML = "";

  for (let i = 0; i < maxPredictions; i++) {
    const labelDiv = document.createElement("div");
    labelDiv.classList.add("label");

    const labelText = document.createElement("span");
    labelText.innerText = "Loading...";

    const progressBar = document.createElement("div");
    progressBar.classList.add("progress-bar");

    const progressFill = document.createElement("div");
    progressFill.classList.add("progress-fill");

    progressBar.appendChild(progressFill);
    labelDiv.appendChild(labelText);
    labelDiv.appendChild(progressBar);
    labelContainer.appendChild(labelDiv);
  }
}

async function loop() {
  webcam.update();
  await predict();
  window.requestAnimationFrame(loop);
}

async function predict() {
  const prediction = await model.predict(webcam.canvas);

  for (let i = 0; i < maxPredictions; i++) {
    const labelDiv = labelContainer.childNodes[i];
    const labelText = labelDiv.querySelector("span");
    const progressFill = labelDiv.querySelector(".progress-fill");

    const percent = (prediction[i].probability * 100).toFixed(1);
    labelText.innerText = `${prediction[i].className}: ${percent}%`;
    progressFill.style.width = percent + "%";
  }
}
