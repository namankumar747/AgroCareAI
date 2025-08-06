const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const snapshot = document.getElementById('snapshot');
const startBtn = document.getElementById('startBtn');
const captureBtn = document.getElementById('captureBtn');
const uploadBtn = document.getElementById('uploadBtn');


let stream;

startBtn.addEventListener('click', async () => {
    try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    video.style.display = 'block';
    startBtn.style.display = 'none';
    captureBtn.style.display = 'block';
    } catch (err) {
    alert("Camera access denied or unavailable.");
    console.error(err);
    }
});

captureBtn.addEventListener('click', () => {
    // Draw image to canvas
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    snapshot.src = canvas.toDataURL('image/png');

    // Stop webcam stream
    stream.getTracks().forEach(track => track.stop());
    video.style.display = 'none';
    captureBtn.style.display = 'none';
    startBtn.style.display = 'block';  // Allow restarting if needed
}); 

analysisBtn.addEventListener('click', async () => {
    const dataURL = snapshot.src;

    if (!dataURL) {
        alert("Please capture an image first.");
        return;
    }

    // Convert dataURL to a Blob (and ensure it's JPG format)
    const blob = await fetch(dataURL).then(res => res.blob());

    const file = new File([blob], "captured.jpg", { type: "image/jpeg" });

    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await fetch("http://127.0.0.1:8000/predict-disease/", {
            method: "POST",
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || "Prediction failed");
        }

        const result = await response.json();
        document.getElementById("disease").innerText = `Disease: ${result.model_prediction}`;
        document.getElementById("description").innerText = `Description: ${result.description}`;
    } catch (error) {
        alert("Upload or prediction failed: " + error.message);
        console.error(error);
    }
});
