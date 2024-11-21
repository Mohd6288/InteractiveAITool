let capture;
let bodyApi;
let poses = []; // Store poses

function setup() {
    createCanvas(640, 480);

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
    });
}

function draw() {
    background(0);

    // Draw video feed
    image(capture, 0, 0, width, height);

    // Draw detected poses
    drawKeypoints();
    drawSkeleton();
}

// Draw keypoints on the canvas
function drawKeypoints() {
    poses.forEach((pose) => {
        pose.pose.keypoints.forEach((keypoint) => {
            if (keypoint.score > 0.2) { // Only draw keypoints with high confidence
                fill(0, 255, 0);
                noStroke();
                ellipse(keypoint.position.x, keypoint.position.y, 10, 10); // Draw keypoint
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
