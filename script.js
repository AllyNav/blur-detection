async function analyzeFrame() {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  const video = document.getElementById('video');

  // Set canvas size to match video
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  // Draw video frame to canvas
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Get image data
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  // Calculate blur using TensorFlow.js
  const sharpness = await calculateSharpness(imageData);
  document.getElementById('blur-result').innerText = 
    sharpness < 100 ? 'Blur Detected' : 'Sharp Video';
}

async function calculateSharpness(imageData) {
  const { data, width, height } = imageData;
  const tfImage = tf.browser.fromPixels({ data, width, height });
  const grayImage = tfImage.mean(2); // Convert to grayscale
  const laplacian = tfImage.sub(grayImage.mean()).square().mean(); // Laplacian variance
  const sharpness = laplacian.dataSync()[0];
  tf.dispose([tfImage, grayImage, laplacian]); // Free memory
  return sharpness;
}

// Run the analysis every 500ms
setInterval(analyzeFrame, 500);
