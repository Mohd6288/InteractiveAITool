let capture;
let bodyApi;
let poses = []; // Store poses
let socket;

function setup() {
    const canvas = createCanvas(640, 480);
    canvas.parent("canvas-container");

    // Initialize WebSocket
    socket = new WebSocket("ws://localhost:8080");

    socket.onopen = () => console.log("Connected to WebSocket server");
    socket.onmessage = (event) => console.log("Message from server:", event.data);
    socket.onerror = (error) => console.error("WebSocket error:", error);
    socket.onclose = () => console.log("WebSocket connection closed");

    // Initialize webcam
    capture = createCapture(VIDEO);
    capture.size(640, 480);
    capture.hide();

    // Initialize PoseNet
    bodyApi = ml5.poseNet(capture, modelReady);
}

function modelReady() {
    console.log("PoseNet is ready!");

    // When poses are detected, update the poses array
    bodyApi.on("pose", (results) => {
        poses = results;
        transmitPoses(results); // Transmit pose data
    });
}

function draw() {
    background(30);

    // Draw video feed
    image(capture, 0, 0, width, height);

    // Draw detected poses
    drawKeypoints();
    drawSkeleton();

    // Display the number of detected people
    fill(255);
    textSize(16);
    text(`Detected People: ${poses.length}`, 10, height - 10);
}

// Draw keypoints on the canvas
function drawKeypoints() {
    poses.forEach((pose) => {
        pose.pose.keypoints.forEach((keypoint) => {
            if (keypoint.score > 0.5) { // Only draw keypoints with high confidence
                fill(0, 255, 0);
                noStroke();
                ellipse(keypoint.position.x, keypoint.position.y, 8, 8); // Draw keypoint
            }
        });
    });
}

// Draw skeleton on the canvas
function drawSkeleton() {
    poses.forEach((pose) => {
        pose.skeleton.forEach(([partA, partB]) => {
            stroke(255, 0, 0);
            strokeWeight(2);
            line(partA.position.x, partA.position.y, partB.position.x, partB.position.y); // Draw skeleton
        });
    });
}

// Transmit detected pose data to WebSocket server
function transmitPoses(results) {
    if (socket.readyState === WebSocket.OPEN) {
        const poseData = results.map((pose) => {
            return {
                keypoints: pose.pose.keypoints.map((kp) => ({
                    part: kp.part,
                    x: kp.position.x,
                    y: kp.position.y,
                    confidence: kp.score,
                })),
                skeleton: pose.skeleton.map(([partA, partB]) => ({
                    partA: partA.part,
                    partB: partB.part,
                    x1: partA.position.x,
                    y1: partA.position.y,
                    x2: partB.position.x,
                    y2: partB.position.y,
                })),
            };
        });

        socket.send(JSON.stringify({ type: "poseData", data: poseData }));
    }
}
