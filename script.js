// script.js

const scanFaceBtn = document.getElementById("scanFaceBtn");
const webcam = document.getElementById("webcam");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const output = document.getElementById("output");

let currentStream = null; // To hold the stream reference

scanFaceBtn.addEventListener("click", startFaceScan);

// Function to start webcam and show video stream
function startFaceScan() {
    // Check if the browser supports getUserMedia
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then((stream) => {
                webcam.srcObject = stream;
                webcam.style.display = 'block';  // Show webcam feed
                scanFaceBtn.textContent = "Capture Image";  // Change button text
                currentStream = stream;  // Store the stream reference
                scanFaceBtn.onclick = captureImage;  // Set capture image function
            })
            .catch((error) => {
                alert("Unable to access webcam: " + error.message);
            });
    } else {
        alert("Your browser does not support webcam access.");
    }
}

// Capture image from webcam
function captureImage() {
    // Set canvas size to video size
    canvas.width = webcam.videoWidth;
    canvas.height = webcam.videoHeight;

    // Draw the image from the webcam onto the canvas
    context.drawImage(webcam, 0, 0, canvas.width, canvas.height);

    // Display the captured image
    const imageData = canvas.toDataURL("image/png");
    output.innerHTML = "<h2>Captured Face</h2><img src='" + imageData + "' alt='Captured Face' />";

    // Stop the webcam stream after capturing
    stopWebcam();

    webcam.style.display = 'none';  // Hide webcam feed
}

// Stop webcam video stream
function stopWebcam() {
    const tracks = currentStream.getTracks();
    tracks.forEach(track => track.stop()); // Stop each track in the stream
}


//slider
const sliderContainer = document.querySelector('.slider-container');
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;
const slideWidth = slides[0].clientWidth;
let currentIndex = 0;
let slideInterval = 3000; // Auto-slide interval (3 seconds)

// Clone the first and last slides for cyclic effect
const firstClone = slides[0].cloneNode(true);
const lastClone = slides[totalSlides - 1].cloneNode(true);

// Append clones to the slider container
sliderContainer.appendChild(firstClone);
sliderContainer.insertBefore(lastClone, slides[0]);

// Adjust the initial position to the first actual slide
sliderContainer.style.transform = `translateX(-${slideWidth}px)`;

let autoSlide = setInterval(moveToNextSlide, slideInterval);

function moveToNextSlide() {
    currentIndex++;
    sliderContainer.style.transition = "transform 0.5s ease-in-out";
    sliderContainer.style.transform = `translateX(-${(currentIndex + 1) * slideWidth}px)`;

    // Reset position after reaching the end
    sliderContainer.addEventListener('transitionend', () => {
        if (currentIndex === totalSlides) {
            currentIndex = 0;
            sliderContainer.style.transition = "none";
            sliderContainer.style.transform = `translateX(-${slideWidth}px)`;
        }
    });
}

// Function to pause and resume slider on hover
function stopAutoSlide() {
    clearInterval(autoSlide);
}

function startAutoSlide() {
    autoSlide = setInterval(moveToNextSlide, slideInterval);
}

sliderContainer.addEventListener('mouseover', stopAutoSlide);
sliderContainer.addEventListener('mouseout', startAutoSlide);



//message
const express = require('express');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Function to store message in Excel
function storeMessageInExcel(message) {
    const filePath = path.join(__dirname, 'Book2.xlsx');
    let workbook;
    let worksheet;

    // Check if file exists, create if not
    if (fs.existsSync(filePath)) {
        workbook = xlsx.readFile(filePath);
        worksheet = workbook.Sheets['Messages'] || workbook.Sheets[workbook.SheetNames[0]];
    } else {
        workbook = xlsx.utils.book_new();
        worksheet = xlsx.utils.json_to_sheet([]);
        xlsx.utils.book_append_sheet(workbook, worksheet, 'Messages');
    }

    // Get existing data
    const data = xlsx.utils.sheet_to_json(worksheet);
    const newEntry = { ID: data.length + 1, Message: message };

    // Append new message
    data.push(newEntry);
    const newSheet = xlsx.utils.json_to_sheet(data);
    workbook.Sheets['Messages'] = newSheet;

    // Write back to the Excel file
    xlsx.writeFile(workbook, filePath);
}

// Endpoint to receive messages
app.post('/send-message', (req, res) => {
    const { message } = req.body;

    if (message) {
        storeMessageInExcel(message);
        res.send('Message saved to Excel successfully.');
    } else {
        res.status(400).send('Message is required.');
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
