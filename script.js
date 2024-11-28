const video = document.getElementById('webcam');

const canvas = document.getElementById('canvas');

const context = canvas.getContext('2d');

const button = document.getElementById('toggleDetection');

let toggleButton; 
let isDetecting = false;
let model;
let detectFrame;
let stream; 
async function setupCamera() {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  video.srcObject = stream;
  return new Promise((resolve) => {
    video.onloadedmetadata = () => {
      resolve(video);
    };
  });
}

async function loadModel() {
    model = await cocoSsd.load();
}
async function startDetection() {
    if (!isDetecting) {
            isDetecting = true;
            await setupCamera();
            video.play();
    
            const detectFrame = () => {
                model.detect(video).then((predictions) => {
                    context.clearRect(0, 0, canvas.width, canvas.height);
                    context.drawImage(video, 0, 0, canvas.width, canvas.height);
                    predictions.forEach(prediction => {
                        context.beginPath();
                        context.rect(...prediction.bbox);
                        context.lineWidth = 2;
                        context.strokeStyle = 'red';
                        context.fillStyle = 'red';
                        context.stroke();
                        context.fillText(prediction.class, prediction.bbox[0], prediction.bbox[1] > 10 ? prediction.bbox[1] - 5 : 10);
                    });
                    requestAnimationFrame(detectFrame);
                });
            };
    
            detectFrame();
            toggleButton.textContent = 'Stop Detection';
        }
    }
    
    
    function stopDetection() {
        if (isDetecting) {
            isDetecting = false;
            cancelAnimationFrame(detectFrame); 
            toggleButton.textContent = 'Start Detection';
            context.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
            video.pause();
            if (stream) {
            stream.getTracks().forEach((track) => track.stop()); // Stop all video tracks
            video.srcObject = null;
        }
    }
}
    
    
    document.addEventListener('DOMContentLoaded', async () => {
        toggleButton = document.getElementById('toggleDetection');
        await loadModel();
    
        
        toggleButton.addEventListener('click', () => {
            if (isDetecting) {
                stopDetection();
            } else {
                startDetection();
            }
        });
    });