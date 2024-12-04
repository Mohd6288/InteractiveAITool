README.md
Interactive AI Tool
Interactive AI Tool is a real-time motion and gesture detection web application. It uses cutting-edge AI models to perform tasks like face tracking, hand gesture recognition, body pose estimation, and style transfer on webcam video feeds. The tool provides an interactive interface with multi-page functionality and WebSocket integration.

Features
Face Tracking and Emotion Detection: Detect facial landmarks and classify emotions in real-time.
Hand Gesture Recognition: Track hand movements and recognize gestures like "Thumbs Up" or "Open Hand".
Body Pose Estimation: Detect full-body poses and skeletal landmarks.
Style Transfer: Apply artistic styles to the live webcam feed.
WebSocket Integration: Send motion and gesture data to a backend for real-time control of external systems.
Live Demo
Coming soon!

Setup Instructions
Prerequisites
Node.js and npm (Node Package Manager)
Modern browser (e.g., Chrome, Firefox)
Python (optional for advanced backend tasks)
Installation
Clone the Repository:

bash
Copy code
git clone https://github.com/Mohd6288/InteractiveAITool.git
cd InteractiveAITool
Install Dependencies:

bash
Copy code
npm install
Start the WebSocket Server:

bash
Copy code
node server.js
Launch the Application: Open index.html in your browser to start the interactive AI tool.

Project Structure
plaintext
Copy code
.
├── index.html            # Homepage
├── face.html             # Face tracking and emotion detection
├── hand.html             # Hand tracking and gesture detection
├── body.html             # Body pose estimation
├── styleRealTime.html    # Style transfer
├── server.js             # WebSocket server
├── src/
│   ├── js/
│   │   ├── face.js       # Face tracking script
│   │   ├── hand.js       # Hand gesture script
│   │   ├── body.js       # Body pose script
│   │   ├── styleRealTime.js # Style transfer script
│   └── styles/
│       ├── styles.css    # Common styles
└── README.md             # Project documentation
Dependencies
Frontend
p5.js: https://p5js.org/
ml5.js: https://ml5js.org/
Bootstrap: https://getbootstrap.com/
MediaPipe:
Hands: https://google.github.io/mediapipe/hands
Pose: https://google.github.io/mediapipe/pose
Camera Utils: https://google.github.io/mediapipe/camera_utils
Frontend dependencies are loaded via CDNs in the HTML files:

html
Copy code
<script src="https://cdn.jsdelivr.net/npm/p5@1.6.0/p5.js"></script>
<script src="https://unpkg.com/ml5@0.6.0/dist/ml5.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@mediapipe/pose/pose.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.min.js"></script>
Backend
WebSocket Server:
Install ws:
bash
Copy code
npm install ws
How It Works
Face Tracking
Detects facial landmarks and emotions using ml5.js.
Outputs emotion data to the UI and sends it to the WebSocket server.
Hand Tracking
Tracks hand landmarks using MediaPipe Hands.
Recognizes gestures like "Thumbs Up" and streams data via WebSocket.
Body Pose
Tracks body landmarks and skeletal points using MediaPipe Pose.
Streams pose data in real time.
Style Transfer
Applies artistic filters to the live webcam feed using ml5.styleTransfer.
WebSocket
Sends real-time motion and gesture data from each page to the backend server.
Enables control of connected systems or devices based on detected actions.
Usage
Navigate to a Page:
Open face.html, hand.html, body.html, or styleRealTime.html in your browser.
Allow Webcam Access:
Grant permission for the application to access your webcam.
Perform Actions:
Perform gestures, poses, or style transfers, and see the results in real time.
Use WebSocket:
Extend the functionality to control devices or trigger events with backend integration.
To-Do
Improve gesture recognition for complex hand gestures.
Add real-time style switching for the style transfer page.
Integrate a database to save motion and gesture history.
Deploy the WebSocket server to a cloud service.
Contributing
Feel free to fork this repository and contribute! Open an issue or submit a pull request if you have suggestions or find bugs.

License
This project is licensed under the MIT License.
