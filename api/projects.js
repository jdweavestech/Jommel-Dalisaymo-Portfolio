// api/projects.js
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const bodyParser = require('body-parser');

// Set up file path and uploads directory
const filePath = path.resolve(__dirname, '../projects.json');
const uploadsDir = path.resolve(__dirname, '../public/uploads');

// Ensure the 'uploads' directory exists
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

// Main function for handling requests
export default async function handler(req, res) {
    // Parse incoming JSON body (use Vercel's body parsing automatically)
    if (req.method === 'POST') {
        upload.single('project-img')(req, res, (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error uploading file', error: err });
            }

            const projectData = req.body;
            const projects = JSON.parse(fs.readFileSync(filePath, 'utf8'));

            // If an image is uploaded, include its path
            if (req.file) {
                projectData.img = `/uploads/${req.file.filename}`; // Path relative to public
            }

            // Add new project data
            projects.push(projectData);

            // Save updated projects to the JSON file
            fs.writeFileSync(filePath, JSON.stringify(projects, null, 2), 'utf8');

            res.status(201).json({ message: 'Project added successfully!' });
        });
    } else if (req.method === 'GET') {
        try {
            const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            res.status(200).json(data);
        } catch (error) {
            res.status(500).json({ message: 'Error reading projects data' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
