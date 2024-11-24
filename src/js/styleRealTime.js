let styleModel;  // Global variable to hold the style transfer model
let video;       // Video element
let graphics;    // Offscreen graphics canvas
let img;         // Styled image
const styles = ["wave", "scream", "udnie", "la_muse", "rain_princess"]; // List of styles

function setup() {
    const canvas = createCanvas(640, 480);
    canvas.parent("canvas-container");

    // Load webcam
    video = createCapture(VIDEO, videoLoaded);
    video.size(640, 480);
    video.hide();

    // Create an off-screen canvas
    graphics = createGraphics(640, 480);

    // Add a dropdown for style selection
    const dropdown = createSelect();
    dropdown.parent("style-selector"); // Attach to the HTML element
    dropdown.option("Select a Style");
    styles.forEach((style) => dropdown.option(style));

    // Listen for style changes
    dropdown.changed(() => {
        const selectedStyle = dropdown.value();
        if (selectedStyle !== "Select a Style") {
            loadStyleModel(selectedStyle);
        }
    });
}

function videoLoaded() {
    console.log("Video loaded!");
}

function loadStyleModel(style) {
    const styleURL = `https://raw.githubusercontent.com/ml5js/ml5-data-and-models/main/models/style-transfer/${style}`;

    // Load the selected style transfer model
    styleModel = ml5.styleTransfer(styleURL, modelLoaded);
    console.log(`Loading style: ${style}`);
}

function modelLoaded() {
    console.log("Style transfer model loaded!");
    transferStyle();
}

function transferStyle() {
    if (!styleModel) {
        console.error("Style model not loaded!");
        return;
    }

    // Apply style transfer using the graphics buffer
    styleModel.transfer(graphics, (err, result) => {
        if (err) {
            console.error("Error during style transfer:", err);
            return;
        }

        // Update the styled image
        img = createImg(result.src).hide();

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
