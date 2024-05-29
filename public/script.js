navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia
    || navigator.mozGetUserMedia || navigator.msGetUserMedia;

// Cross browser support for window.URL.
window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;

var MotionDetector = (function () {
    var alpha = 0.5;
    var version = 0;
    var greyScale = false;
    var lastMotionTime = 0; // To track the time of last motion detected
    var motionDetected = false; // Flag to prevent continuous detection
    var previousImageData = null; // To store the image data of the last sent image
    var noMotionInterval = 10000; // 1 minute in milliseconds

    var canvas = document.getElementById('canvas');
    var canvasFinal = document.getElementById('canvasFinal');
    var video = document.getElementById('camStream');
    var ctx = canvas.getContext('2d');
    var ctxFinal = canvasFinal.getContext('2d');
    var localStream = null;
    var imgData = null;
    var imgDataPrev = [];

    function success(stream) {
        localStream = stream;
        // Create a new object URL to use as the video's source.
        video.srcObject = stream;
        video.play();
    }

    function handleError(error) {
        console.error(error);
    }

    function snapshot() {
        if (localStream) {
            canvas.width = video.offsetWidth;
            canvas.height = video.offsetHeight;
            canvasFinal.width = video.offsetWidth;
            canvasFinal.height = video.offsetHeight;

            ctx.drawImage(video, 0, 0);

            // Must capture image data in new instance as it is a live reference.
            // Use alternative live references to prevent messed up data.
            imgDataPrev[version] = ctx.getImageData(0, 0, canvas.width, canvas.height);
            version = (version == 0) ? 1 : 0;

            imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

            var length = imgData.data.length;
            var x = 0;
            while (x < length) {
                if (!greyScale) {
                    // Alpha blending formula: out = (alpha * new) + (1 - alpha) * old.
                    imgData.data[x] = alpha * (255 - imgData.data[x]) + ((1 - alpha) * imgDataPrev[version].data[x]);
                    imgData.data[x + 1] = alpha * (255 - imgData.data[x + 1]) + ((1 - alpha) * imgDataPrev[version].data[x + 1]);
                    imgData.data[x + 2] = alpha * (255 - imgData.data[x + 2]) + ((1 - alpha) * imgDataPrev[version].data[x + 2]);
                    imgData.data[x + 3] = 255;
                } else {
                    // GreyScale.
                    var av = (imgData.data[x] + imgData.data[x + 1] + imgData.data[x + 2]) / 3;
                    var av2 = (imgDataPrev[version].data[x] + imgDataPrev[version].data[x + 1] + imgDataPrev[version].data[x + 2]) / 3;
                    var blended = alpha * (255 - av) + ((1 - alpha) * av2);
                    imgData.data[x] = blended;
                    imgData.data[x + 1] = blended;
                    imgData.data[x + 2] = blended;
                    imgData.data[x + 3] = 255;
                }
                x += 4;
            }
            ctxFinal.putImageData(imgData, 0, 0);

            if (detectMotion(imgData, imgDataPrev[version], canvas.width, canvas.height)) {
                const now = Date.now();
                const diffValue = calculateDiff(imgData, previousImageData);
                if (!motionDetected || (now - lastMotionTime) > 10000) { // 1-minute gap
                    if (previousImageData == null || diffValue > 0.08 * canvas.width * canvas.height) { // Only send if the current image is significantly different
                        motionDetected = true;
                        lastMotionTime = now;
                        previousImageData = imgData;
                        console.log("Motion detected! Capturing and sending image.");
                        // alert('Motion detected!');
                        sendImage();
                    } else {
                        // console.log("Motion detected but no significant change in the image.");
                    }
                }
            } else {
                if (motionDetected && (Date.now() - lastMotionTime) > noMotionInterval) {
                    motionDetected = false;
                    previousImageData = null;
                    console.log("Resetting motion detected flag and previous image data due to no motion.");
                }
            }
        }
    }

    function detectMotion(current, previous, width, height) {
        var diffThreshold = 280; // Adjust as needed
        var diff = 0;
        for (var i = 0; i < current.data.length; i += 4) {
            var r1 = current.data[i], g1 = current.data[i + 1], b1 = current.data[i + 2];
            var r2 = previous.data[i], g2 = previous.data[i + 1], b2 = previous.data[i + 2];
            var delta = Math.abs(r1 - r2) + Math.abs(g1 - g2) + Math.abs(b1 - b2);
            if (delta > diffThreshold) {
                diff++;
            }
        }
        return diff > (0.08 * width * height); // Adjust sensitivity as needed
    }

    function calculateDiff(current, previous) {
        if (!previous) return Infinity; // If no previous image, consider it as maximum difference
        var diffThreshold = 280; // Adjust as needed
        var diff = 0;
        for (var i = 0; i < current.data.length; i += 4) {
            var r1 = current.data[i], g1 = current.data[i + 1], b1 = current.data[i + 2];
            var r2 = previous.data[i], g2 = previous.data[i + 1], b2 = previous.data[i + 2];
            var delta = Math.abs(r1 - r2) + Math.abs(g1 - g2) + Math.abs(b1 - b2);
            if (delta > diffThreshold) {
                diff++;
            }
        }
        return diff;
    }

    function sendImage() {
        console.log("Preparing to send image...");
        canvas.toBlob(function (blob) {
            var formData = new FormData();
            formData.append('image', blob, 'motion.png');
            console.log("Image captured, sending...");

            fetch('http://localhost:6754/upload', {
                method: 'POST',
                body: formData
            }).then(response => {
                return response.text();
            }).then(data => {
                console.log('Image sent successfully:', data);
            }).catch(error => {
                console.error('Error sending image:', error);
            });
        }, 'image/png');
    }

    function init_() {
        if (navigator.getUserMedia) {
            navigator.getUserMedia({ video: true }, success, handleError);
        } else {
            console.error('Your browser does not support getUserMedia');
        }
        window.setInterval(snapshot, 32);
    }

    return {
        init: init_
    };
})();

MotionDetector.init();
