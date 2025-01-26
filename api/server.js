// api/projects.js

const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const filePath = './projects.json';

// Ensure 'uploads' directory exists inside the 'public' folder
const uploadsDir = path.resolve(__dirname, '../public/uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads (images)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir); // Path for saving uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filenames
    },
});

const upload = multer({ storage: storage });

module.exports = (req, res) => {
    if (req.method === 'POST') {
        upload.single('project-img')(req, res, (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error uploading file', error: err });
            }

            const projectData = req.body;
            const projects = JSON.parse(fs.readFileSync(filePath, 'utf8'));

            // Handle file data if an image was uploaded
            if (req.file) {
                projectData.img = `/uploads/${req.file.filename}`; // Save the public path to the image
            }

            // Add new project data
            projects.push(projectData);

            // Save updated projects to the JSON file
            fs.writeFileSync(filePath, JSON.stringify(projects, null, 2), 'utf8');

            res.status(201).json({ message: 'Project added successfully!' });
        });
    } else if (req.method === 'GET') {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        res.status(200).json(data);
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
};
