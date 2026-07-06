const pixels = document.getElementsByClassName("pixel");
const pixelContainer = document.getElementById("pixel-container");
const colourSelect = document.getElementsByClassName("colour");
const showColour = document.getElementById("show-colour");
const screenshotOutput = document.getElementById("screenshot-result");
const screenshotBtn = document.getElementById("screenshot-btn");

let pixelNumber = 0;

//dynamically getting the colour values from computed styles for each available colour

let coloursRGBA = [];

for (let i = 0; i < colourSelect.length; i ++) {
  let rgbColour = window.getComputedStyle(colourSelect[i]).getPropertyValue("background-color");
  let rgb = [];

  rgbColour = rgbColour.replace(/[^\d,]/g, '').split(',');

  for (let ia = 0; ia < 3; ia++) {
    rgb.push(parseInt(rgbColour[ia]));
  }
  coloursRGBA.push(rgb);
}

//colour button positions and colour name, not dynamic yet
const colours = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9
]

const colourClass = [
  'white', 'grey', 'black', 'red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink'
]


let selectedArrayColour = 0;
let selectedColour = "white";

// for selecting the colour and putting it in show-colour
for (let i = 0; i < colourSelect.length; i++) {
  colourSelect[i].addEventListener("click", (event) => {
    selectedColour = colourClass[i];
    selectedArrayColour = colours[i];
    showColour.classList.add(selectedColour);
    if (showColour.classList.length > 1) { 
      let oldShowColour = showColour.classList[0];
      showColour.classList.remove(oldShowColour);
      }
  });
}

//changes pixel classes to change background colour on click
function addEvents() {
  for (let i = 0; i < pixels.length; i++) {
    pixels[i].addEventListener("click", (event) => {
      gridState.splice(i, 1, selectedArrayColour)
      for ( let ia = 0; ia < colourSelect.length; ia++) {
        let oldColour = colourSelect[ia].classList[1];
        event.target.classList.remove(oldColour);
      }
      event.target.classList.add(selectedColour);
      
    });
  }
}

//add all the span classes that make up the pixels.

let gridState = [];
let gridSize = 0;

function populatePixels() {
  gridSize = pixelNumber * pixelNumber;

  let html ="";

  for (let i = 0; i < gridSize; i++) {
    html += `<span class="pixel white" data-index="${i}"></span>`;
    gridState.push(0);
  }
  pixelContainer.innerHTML = html;

  pixelContainer.style.gridTemplateColumns = `repeat(${pixelNumber}, 1fr)`;
  pixelContainer.style.gridTemplateRows = `repeat(${pixelNumber}, 1fr)`;
}

// screenshot functionality, adds current gridstate to screenshot array and allCanvas array
const frameNo = document.getElementById('frame-no');
let screenshots = [];
let allCanvas = [];

function takeScreenshot() {
  const currentCanvas = [];

  screenshots.push([...gridState]);

  for (let i = 0; i < gridSize; i++) {
    currentCanvas.push(coloursRGBA[gridState[i]]);
  }
  allCanvas.push(currentCanvas);
}

//take screencap of current frame, updates frame count
screenshotBtn.addEventListener("click", () => {
  takeScreenshot();
  frameNo.innerText = screenshots.length;
});

const pixelBtn = document.getElementById('pixel-btn');
const pixelCount = document.getElementById('pixel-count');

//sets the pixel count for the container 
pixelBtn.addEventListener("click", () => {
  pixelNumber = Number(pixelCount.value);
  populatePixels();
  addEvents();
  document.getElementById('pixel-question').classList.add('hidden');
});

//clear current canvas
const canvasResfresh = document.getElementById('delete-btn');

canvasResfresh.addEventListener("click", () => {
  gridState = [];
  populatePixels(Number(pixelNumber));
  addEvents();
});

//toggles the grid
const gridBtn = document.getElementById('grid-toggle');

gridBtn.addEventListener("click", () => {
  for (let i = 0; i < gridSize; i++) {
    pixels[i].classList.toggle("grid-style");
  }
});

//canvas gif functionality
const frameCounter = document.getElementById('current-frame-no');

let animationInterval;
let currentFrame = [];
let currentFrameNo = 0;
let isRunning = true;

function animate() {
    if (isRunning) {
      clearInterval(animationInterval);
      animationInterval = setInterval(showFrameAll, 400);
    } else {
      clearInterval(animationInterval);
    }
}

const canvas = document.getElementById("canvas");

function showFrame() {
  canvas.dataset.indexNumber = (currentFrameNo);

  const pixelSize = canvas.width / pixelNumber;
  const ctx = canvas.getContext("2d");
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let j = 0; j < gridSize; j++) {
      const x = j % pixelNumber;
      const y = Math.floor(j / pixelNumber);
      const canvasPixel = allCanvas[currentFrameNo][j];
      
      ctx.fillStyle = `rgb(${canvasPixel[0]}, ${canvasPixel[1]}, ${canvasPixel[2]})`;

      ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
    }

  frameCounter.innerText = (currentFrameNo + 1);
}
  
function showFrameAll() {
  showFrame();
  currentFrameNo = (currentFrameNo + 1) % allCanvas.length;
}

//makes the gif happen
const gifBtn = document.getElementById('gif-btn');

gifBtn.addEventListener("click", () => {
  animate();
});