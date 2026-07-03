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

//test button

// const test = document.getElementById("test");

// test.addEventListener("click", ()=> {
//   console.log(allCanvasTest[0][0]);
// });

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

// screenshot functionality, adds current gridstate to screenshot array
const frameNo = document.getElementById('frame-no');
let screenshots = [];
let allCanvasTest = [];
let currentCanvasTest = [];

function takeScreenshot() {
  
  screenshots.push([...gridState]);

  for (let i = 0; i < gridSize; i++) {
    currentCanvasTest.push(coloursRGBA[gridState[i]]);
  }
  allCanvasTest.push(currentCanvasTest);
}

let canvasPixel = 0;

//experimenting to make a gif of saveable images instead of rendered html

// function makeImage(array) {
//   const canvas = document.getElementById("canvas");

//   const ctx = canvas.getContext("2d");
  
//   for (let i = 0; i < gridSize; i++) {
//     const x = i % pixelNumber;
//     const y = Math.floor(i / pixelNumber);
//     canvasPixel = array[i];
    
//     ctx.fillStyle = `rgb(${canvasPixel[0]}, ${canvasPixel[1]}, ${canvasPixel[2]})`;

//     const pixelSize = 600 / pixelNumber;

//     ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
//   }
// }

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

//show individual frames (experimental)

// const framesShowBtn = document.getElementById('frames-show-btn');

// framesShowBtn.addEventListener("click", () => {
//   for (let i = 0; i < allCanvasTest.length; i++) {
//   console.log(allCanvasTest.length);
//     makeImage(allCanvasTest[i]);
//     currentCanvasTest = [];
//   }
// });

//makes the gif happen
const gifBox = document.getElementById('gif');
const gifBtn = document.getElementById('gif-btn');

gifBtn.addEventListener("click", () => {
  gifBox.classList.add("grid");
  gifBox.classList.remove("hidden");
  gifBox.style.gridTemplateColumns = `repeat(${pixelNumber}, 1fr)`;
  gifBox.style.gridTemplateRows = `repeat(${pixelNumber}, 1fr)`;
  populateGif();
});

function populateGif() {
  gridSize = pixelNumber * pixelNumber;
  let i = 0;

  function renderFrame() {
    let html = "";
 
    for (let ia = 0; ia < gridSize; ia++) {
      let pixelColour = screenshots[i][ia];     
      html += `<span class="pixel ${colourClass[pixelColour]}"></span>`;
    }

  gifBox.innerHTML = html;

  i = (i + 1) % screenshots.length;

 }
 setInterval(renderFrame, 300);
}
//toggles the grid
const gridBtn = document.getElementById('grid-toggle');

gridBtn.addEventListener("click", () => {
  for (let i = 0; i < gridSize; i++) {
    pixels[i].classList.toggle("grid-style");
  }
});

