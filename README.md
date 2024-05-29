# AI Powered Home-Security System Client

This is the client-side application of the AI-Powered Home Security System. It uses the camera to detect motion and sends images to the backend server for analysis when motion is detected.

## Table of Contents

- [Description](#description)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Description

The client-side application of the AI-Powered Home Security System utilizes an external or laptop camera to monitor for motion. When motion is detected, it captures an image and sends it to the backend server for analysis. The server then processes the image and sends alerts via email and SMS if necessary.

## Features

- Motion detection using the camera
- Automatic image capture upon motion detection
- Real-time communication with the backend server for image analysis
- Responsive design for use on various devices

## Installation

To get started with the client-side application, follow these steps:

### Prerequisites

Make sure you have the following installed on your system:

- Node.js (https://nodejs.org/)
- npm (Node Package Manager, comes with Node.js)

### Clone the Repository

Clone the repository to your local machine using the following command:

```bash
git clone https://github.com/AI-Varun/AI-Powered-Security-System-Client.git
```

### Install Dependencies
Navigate to the project directory and install the required dependencies:

```bash
npm install
```
### Usage
To run the application locally, use the following command:
```bash
npm run dev 
```

This will start the development server and open the application in your default web browser. If it doesn't open automatically, navigate to http://localhost:3000 in your browser.

### Motion Detection and Image Capture
* The application will use the camera to monitor for motion.
* When motion is detected, an image will be captured and sent to the backend server automatically.

### Contributing
Contributions are welcome! To contribute to this project, follow these steps:

* Fork the repository.
* Create a new branch (git checkout -b feature-branch).
* Make your changes.
* Commit your changes (git commit -m 'Add some feature').
* Push to the branch (git push origin feature-branch).
* Open a Pull Request.