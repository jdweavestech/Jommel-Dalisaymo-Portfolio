const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = 3000;
const filePath = './projects.json';

// Ensure 'uploads' directory exists inside the 'public' folder
const uploadsDir = path.resolve(__dirname, './public/uploads');
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

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.resolve(__dirname, './public'))); // Serve static files in 'public'

// Serve 'uploads' folder for browser access
app.use('/uploads', express.static(uploadsDir));

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the API server!');
});

// POST /api/projects
app.post('/api/projects', upload.single('project-img'), (req, res) => {
    const projectData = req.body;
    const projects = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    // Handle file data if an image was uploaded
    if (req.file) {
        projectData.img = `/uploads/${req.file.filename}`; // Save the public path to the image
    } else {
        console.log('No file uploaded');
    }

    // Add new project data
    projects.push(projectData);

    // Save updated projects to the JSON file
    fs.writeFileSync(filePath, JSON.stringify(projects, null, 2), 'utf8');

    res.status(201).json({ message: 'Project added successfully!' });
});

// GET /api/projects
app.get('/api/projects', (req, res) => {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    res.json(data);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
