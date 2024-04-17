import express from 'express';
import { exec, spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
const app = express();
const port = 4000;


// Convert the file URL to a file path
const __filename = fileURLToPath(import.meta.url);
// Get the directory name of the current module
const __dirname = path.dirname(__filename);

// Correctly set up the path to the 'public' directory
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// Call script to Json file with random images
app.post('/randomizer-script', (req, res) => {
    const { num } = req.body;

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

function runScript(width, height, directory) {
    const script = spawn('bash', ['./utils/resize-image.sh', width, height, directory], {
        detached: true,
        stdio: 'ignore'
    });

    script.unref(); // This allows the parent process to exit independently of the child.
}

// Resize images script
app.post('/resize-script', (req, res) => {
    const { width, height } = req.body;
    const directory = path.join(__dirname, '..', 'public', 'images', 'dataSets', 'sharks');
    runScript(width, height, directory);
    res.send({ status: 'success', message: 'Script is running in the background' });
});

// Write config,json endpoint; Receive key and value and change or add if not exist
app.post('/write-config', (req, res) => {
    const { key, value } = req.body;
    const configPath = path.join(__dirname, '.','fossil.conf');
    console.log('WRITING COMG');
    exec(`bash ./utils/write-config.sh ${configPath} ${key} ${value}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(500).send({ status: 'error', message: `Script execution failed: ${error.message}` });
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);

        res.send({ status: 'success', output: stdout });
    });
});

// Endpoint to read all configurations
app.get('/read-config', (req, res) => {
    const configPath = path.join(__dirname, 'fossil.conf');

    fs.readFile(configPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Failed to read configuration file:', err);
            return res.status(500).send({ status: 'error', message: 'Failed to read configuration file' });
        }

        const config = data.split('\n')
            .filter(line => line.includes('==')) 
            .reduce((acc, line) => {
                const [key, value] = line.split('==');
                acc[key.trim()] = value.trim();
                return acc;
            }, {});

        res.send({ status: 'success', configuration: config });
    });
});





// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
