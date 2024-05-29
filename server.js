const express = require('express');
const multer = require('multer');
const app = express();
const port = 3000;

// Serve static files from the public directory
app.use(express.static('public'));

// Set up multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    console.log('Image received:', req.file.originalname);
    // Save the file or process it as needed
    // Here we're just sending a response back to the client
    res.send('Image received successfully.');
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
