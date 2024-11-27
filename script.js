const video = document.getElementById('webcam');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

async function setupCamera() {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  video.srcObject = stream;
  return new Promise((resolve) => {
    video.onloadedmetadata = () => {
      resolve(video);
    };
  });
}

async function detectObjects() {
  const model = await cocoSsd.load();
  await setupCamera();
  video.play();
  video.hidden();
  function detectFrame() {
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
  }

  detectFrame();
}

detectObjects();