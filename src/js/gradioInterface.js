import { Client } from "@gradio/client";

// Connect to the Gradio app
(async () => {
    try {
        // Replace the URL below with your Gradio app's public URL
        const client = await Client.connect("https://07fd3ca65765c95240.gradio.live/");

        // Define input parameters
        const inputs = {
            prompt: "A futuristic Arabian robot driving an old GMC truck in the desert, photorealistic 4K",
            strength: 0.8,       // Strength parameter (0 to 1)
            num_images: 1,       // Number of images to generate
            num_steps: 50        // Number of inference steps
        };

        // Call the predict function
        const result = await client.predict("/predict", inputs);

        // Log the result
        console.log("Generated Images:", result.data);

        // If result includes image URLs, log or download them
        result.data.forEach((image, index) => {
            console.log(`Image ${index + 1}:`, image);
        });
    } catch (error) {
        console.error("Error:", error);
    }
})();
