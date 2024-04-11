import express from 'express';
import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = 4000;

// Convert the file URL to a file path
const __filename = fileURLToPath(import.meta.url);
// Get the directory name of the current module
const __dirname = path.dirname(__filename);

// Correctly set up the path to the 'public' directory
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// Route to execute a script
app.post('/execute-script', (req, res) => {
    const { num } = req.body;

    // Assuming the current working directory is 'src' when this script is executed
    exec(`bash ./utils/create-json.sh sharks ${num}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(500).send({ status: 'error', message: `Script execution failed: ${error.message}` });
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);

        res.send({ status: 'success', output: stdout });
    });
});


// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
