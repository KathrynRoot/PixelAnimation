const pauseBtn = document.getElementById('pause-animation');
const playBtn = document.getElementById('play-animation');

pauseBtn.addEventListener("click", () => {
    isRunning = false;
    currentFrameNo = (Number(canvas.dataset.indexNumber));
    animate();
});

playBtn.addEventListener("click", () => {
    if (allCanvas.length > 0) {
        isRunning = true;
        animate();
    }
});

const prevBtn = document.getElementById('prev-frame');
const nextBtn = document.getElementById('next-frame');

prevBtn.addEventListener("click", () => {
    currentFrameNo = (Number(canvas.dataset.indexNumber)- 1 + allCanvas.length) % allCanvas.length;
    showFrame();
});

nextBtn.addEventListener("click", () => {
    currentFrameNo = (Number(canvas.dataset.indexNumber) + 1) % allCanvas.length;
    showFrame();
});

const deleteFrame = document.getElementById('delete-frame');

deleteFrame.addEventListener("click", () => {
    allCanvas.splice(currentFrameNo, 1);
    if (allCanvas.length > 0) {     
        currentFrameNo = (Number(canvas.dataset.indexNumber)- 1 + allCanvas.length) % allCanvas.length;
        showFrame();
    }
    frameNo.innerText = allCanvas.length;
});