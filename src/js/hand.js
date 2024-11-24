let video; // Video element
let handpose; // ml5 handpose model
let predictions = []; // Store hand predictions

function setup() {
    // Create a canvas and attach it to the DOM
    const canvas = createCanvas(640, 480);
    canvas.parent("canvas-container");

    // Set up the video capture
    video = createCapture(VIDEO);
    video.size(width, height);
    video.hide(); // Hide the default video element

    // Load the handpose model
    handpose = ml5.handpose(video, modelLoaded);

    // Listen for predictions
    handpose.on("predict", (results) => {
        predictions = results;
    });
}

function modelLoaded() {
    console.log("Handpose model loaded!");
}

function draw() {
    background(220);

    // Display the video feed
    image(video, 0, 0, width, height);

    // Draw the hand landmarks
    drawHandLandmarks();
}

function drawHandLandmarks() {
    if (predictions.length > 0) {
        for (let i = 0; i < predictions.length; i++) {
            const landmarks = predictions[i].landmarks;

            // Draw circles for each landmark
            for (let j = 0; j < landmarks.length; j++) {
                const [x, y, z] = landmarks[j];
                fill(0, 255, 0);
                noStroke();
                ellipse(x, y, 10, 10);
            }
        }
    }
}
