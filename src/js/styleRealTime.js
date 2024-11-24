let styleModel; // Global variable to hold the style transfer model
let video;      // Video element
let img;        // Styled image
let graphics;   // Offscreen graphics canvas

function setup() {
    const canvas = createCanvas(640, 480);
    canvas.parent("canvas-container");

    // Load webcam and hide it
    video = createCapture(VIDEO, videoLoaded);
    video.size(640, 480);
    video.hide();

    // Create an off-screen canvas
    graphics = createGraphics(640, 480);
}

function videoLoaded() {
    console.log("Video loaded!");

    // Load the style transfer model
    const style = "wave"; // Replace with your preferred style
    const styleURL = `https://raw.githubusercontent.com/ml5js/ml5-data-and-models/main/models/style-transfer/${style}`;
    
    // Load the style transfer model and assign it to the global variable
    styleModel = ml5.styleTransfer(styleURL, modelLoaded); // Model loaded callback
}

function modelLoaded() {
    console.log("Style transfer model loaded!");

    // Start applying style transfer
    transferStyle();
}

function transferStyle() {
    if (!styleModel) {
        console.error("Style model not loaded!");
        return;
    }

    // Transfer style using the graphics buffer
    styleModel.transfer(graphics, (err, result) => {
        if (err) {
            console.error("Error during style transfer:", err);
            return;
        }

        // Update the styled image
        img = createImg(result.src).hide();
        console.log("Style transferred successfully!");

        // Recursively call transferStyle for live updates
        transferStyle();
    });
}

function draw() {
    background(0);

    // Draw the raw video feed onto the graphics buffer
    graphics.image(video, 0, 0, width, height);

    // Display the styled image or fallback to raw video feed
    if (img) {
        image(img, 0, 0, width, height);
    } else {
        image(video, 0, 0, width, height);
    }
}
