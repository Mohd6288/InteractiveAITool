let hands;
let camera;
let handLandmarks = [];

function setup() {
    const canvas = createCanvas(640, 480);
    canvas.parent("canvas-container");

    // Initialize video capture
    const videoElement = createCapture(VIDEO);
    videoElement.size(width, height);
    videoElement.hide();

    // Initialize MediaPipe Hands
    hands = new Hands({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });
    hands.setOptions({
        maxNumHands: 2, // Enable multi-hand tracking
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
    });

    // Set up the results callback
    hands.onResults(onHandsResults);

    // Attach camera
    camera = new Camera(videoElement.elt, {
        onFrame: async () => {
            await hands.send({ image: videoElement.elt });
        },
    });
    camera.start();
}

function onHandsResults(results) {
    handLandmarks = results.multiHandLandmarks || [];
    // console.log("Detected Hands:", handLandmarks); // Debugging output
}

function draw() {
    background(220);

    // Draw video
    if (camera && camera.videoElement) {
        image(camera.videoElement, 0, 0, width, height);
    }

    // Draw hand landmarks for each detected hand
    handLandmarks.forEach((hand) => {
        hand.forEach(({ x, y }) => {
            fill(0, 255, 0);
            noStroke();
            ellipse(x * width, y * height, 10, 10);
        });
    });

    // Display the number of detected hands
    fill(0);
    textSize(16);
    text(`Detected Hands: ${handLandmarks.length}`, 10, height - 10);
}
