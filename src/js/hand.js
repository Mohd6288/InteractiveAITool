let video;
let handpose;
let predictions = [];

function setup() {
    const canvas = createCanvas(640, 480);
    canvas.parent("canvas-container");

    // Video capture setup
    video = createCapture(VIDEO);
    video.size(640, 480);
    video.hide();

    // Load the Handpose model
    handpose = ml5.handpose(video, modelReady);

    // Listen for predictions
    handpose.on("predict", (results) => {
        predictions = results;
    });
}

function modelReady() {
    console.log("Handpose model is ready!");
}

function draw() {
    background(0);
    image(video, 0, 0, width, height);

    // Draw the hand landmarks
    drawHand();
}

function drawHand() {
    if (predictions.length > 0) {
        for (let i = 0; i < predictions.length; i++) {
            const prediction = predictions[i];

            // Draw keypoints
            for (let j = 0; j < prediction.landmarks.length; j++) {
                const [x, y, z] = prediction.landmarks[j];
                fill(0, 255, 0);
                noStroke();
                ellipse(x, y, 10, 10);
            }

            // Draw skeleton
            const annotations = prediction.annotations;
            for (let key in annotations) {
                const points = annotations[key];
                for (let k = 0; k < points.length - 1; k++) {
                    const [x1, y1] = points[k];
                    const [x2, y2] = points[k + 1];
                    stroke(255, 0, 0);
                    line(x1, y1, x2, y2);
                }
            }
        }
    } else {
        fill(255);
        textSize(24);
        textAlign(CENTER, CENTER);
        text("No hand detected", width / 2, height / 2);
    }
}
