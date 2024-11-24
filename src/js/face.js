let capture;
const captureWidth = 640;
const captureHeight = 480;

let faceApi;
let socket;
let detections = [];
const emotions = ["neutral", "happy", "sad", "angry", "fearful", "disgusted", "surprised"];

function setup() {
    const canvas = createCanvas(captureWidth, captureHeight);
    canvas.parent("canvas-container");

    // websocket
    socket = new WebSocket("ws://localhost:8080");

    socket.onopen = () => console.log("Connected to WebSocket server");
    socket.onmessage = (event) => console.log("Message from server:", event.data);

    // Video capture setup
    capture = createCapture(VIDEO);
    capture.size(captureWidth, captureHeight);
    capture.hide();

    // FaceAPI setup
    const faceOptions = { withLandmarks: true, withExpressions: true, withDescriptors: false };
    faceApi = ml5.faceApi(capture, faceOptions, faceReady);
}

function faceReady() {
    console.log("FaceAPI is ready!");
    faceApi.detect(gotFaces);
}

function gotFaces(error, results) {
    if (error) {
        console.error(error);
        return;
    }
    detections = results;
    faceApi.detect(gotFaces); // Continue detection
        // Example: Send detected face data to the server
        const faceData = { type: "face", emotion: "Happy" };
        if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(faceData));
        }

}



function draw() {
    background(0);
    image(capture, 0, 0, width, height); // Display the video feed

    // Draw detections
    if (detections.length > 0) {
        detections.forEach((detection) => {
            const points = detection.landmarks.positions;

            // Draw facial landmarks
            for (let i = 0; i < points.length; i++) {
                fill(0, 255, 0);
                ellipse(points[i]._x, points[i]._y, 5, 5);
            }

            // Draw emotion bars
            let yOffset = 20;
            for (let i = 0; i < emotions.length; i++) {
                const emotion = emotions[i];
                const emotionValue = detection.expressions[emotion];

                fill(255);
                text(`${emotion}: ${(emotionValue * 100).toFixed(1)}%`, 10, yOffset);
                fill(255, 0, 0);
                rect(150, yOffset - 10, emotionValue * 200, 10);

                yOffset += 20;
            }
        });
    } else {
        fill(255, 0, 0);
        textSize(24);
        text("No face detected", width / 2 - 100, height / 2);
    }
}
