let hands;
let camera;
let handLandmarks = [];
let gesture = "None"; // Store the detected gesture
let socket;
// Hand landmark connections for skeleton
const HAND_CONNECTIONS = [
    [0, 1], [1, 2], [2, 3], [3, 4], // Thumb
    [0, 5], [5, 6], [6, 7], [7, 8], // Index finger
    [5, 9], [9, 10], [10, 11], [11, 12], // Middle finger
    [9, 13], [13, 14], [14, 15], [15, 16], // Ring finger
    [13, 17], [17, 18], [18, 19], [19, 20], // Pinky finger
];

function setup() {
    const canvas = createCanvas(640, 480);
    canvas.parent("canvas-container");

    // Initialize WebSocket
    socket = new WebSocket("ws://localhost:8080");

    socket.onopen = () => console.log("Connected to WebSocket server");
    socket.onmessage = (event) => console.log("Message from server:", event.data);

    // Initialize video capture
    const videoElement = createCapture(VIDEO);
    videoElement.size(width, height);
    videoElement.hide();

    // Initialize MediaPipe Hands
    hands = new Hands({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });
    hands.setOptions({
        maxNumHands: 2,
        modelComplexity: 1,
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.7,
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
    detectGesture(); // Detect gestures
}

function draw() {
    background(30, 30, 30); // Dark background for better visibility

    // Draw video
    if (camera && camera.videoElement) {
        image(camera.videoElement, 0, 0, width, height);
    }

    // Draw hand landmarks and skeleton
    handLandmarks.forEach((hand) => {
        drawHandSkeleton(hand); // Draw skeleton
        hand.forEach(({ x, y }) => {
            fill(255, 255, 0); // Bright yellow for landmarks
            noStroke();
            ellipse(x * width, y * height, 8, 8);
        });
    });

    // Display the detected gesture
    fill(255);
    textSize(20);
    textAlign(LEFT);
    text(`Gesture: ${gesture}`, 10, height - 20);
}

function drawHandSkeleton(hand) {
    stroke(0, 128, 255); // Soft blue for the skeleton
    strokeWeight(2);
    HAND_CONNECTIONS.forEach(([start, end]) => {
        const p1 = hand[start];
        const p2 = hand[end];
        if (p1 && p2) {
            line(p1.x * width, p1.y * height, p2.x * width, p2.y * height);
        }
    });
}

// Detect basic gestures using angles
function detectGesture() {
    if (handLandmarks.length > 0) {
        const hand = handLandmarks[0];

        // Use landmarks to calculate distances and detect gestures
        const thumbTip = hand[4];
        const indexTip = hand[8];
        const middleTip = hand[12];
        const ringTip = hand[16];
        const pinkyTip = hand[20];
        const wrist = hand[0];

        // Example: Detect "Thumbs Up"
        const isThumbsUp =
            dist(thumbTip.x, thumbTip.y, wrist.x, wrist.y) > 0.3 &&
            dist(indexTip.x, indexTip.y, wrist.x, wrist.y) < 0.2;

        // Example: Detect "Open Hand"
        const isOpenHand =
            dist(thumbTip.x, thumbTip.y, wrist.x, wrist.y) > 0.4 &&
            dist(indexTip.x, indexTip.y, wrist.x, wrist.y) > 0.4 &&
            dist(middleTip.x, middleTip.y, wrist.x, wrist.y) > 0.4 &&
            dist(ringTip.x, ringTip.y, wrist.x, wrist.y) > 0.4 &&
            dist(pinkyTip.x, pinkyTip.y, wrist.x, wrist.y) > 0.4;

        if (isThumbsUp) {
            gesture = "Thumbs Up";
        } else if (isOpenHand) {
            gesture = "Open Hand";
        } else {
            gesture = "Unknown Gesture";
        }
    } else {
        gesture = "No Hands Detected";
    }

    // Send gesture data to the server
    if (handLandmarks.length > 0) {
        const gestureData = { type: "hand", gesture: "Thumbs Up" };
        if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(gestureData));
        }
    }
}
