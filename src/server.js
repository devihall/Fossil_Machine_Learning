import express from 'express';
import next from 'next';
import { exec, spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const port = 4000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  server.use(express.json());

  // Correctly set up the path to the 'public' directory
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  server.use(express.static(path.join(__dirname, 'public')));

  // API endpoints
  server.post('/randomizer-script', async (req, res) => {
    const { num } = req.body;
    exec(`bash ./utils/create-json.sh sharks ${num}`, (error, stdout, stderr) => {
      if (error) {
        return res.status(500).send({ status: 'error', message: `Script execution failed: ${error.message}` });
      }
      res.send({ status: 'success', output: stdout });
    });
  });

  server.post('/resize-script', async (req, res) => {
    const { width, height } = req.body;
    const directory = path.join(__dirname, 'public', 'images', 'dataSets', 'sharks');
    const script = spawn('bash', ['./utils/resize-image.sh', width, height, directory], {
      detached: true,
      stdio: 'ignore'
    });
    script.unref();
    res.send({ status: 'success', message: 'Script is running in the background' });
  });

  server.post('/write-config', async (req, res) => {
    const { key, value } = req.body;
    const configPath = path.join(__dirname, 'fossil.conf');
    exec(`bash ./utils/write-config.sh ${configPath} ${key} ${value}`, (error, stdout, stderr) => {
      if (error) {
        return res.status(500).send({ status: 'error', message: `Script execution failed: ${error.message}` });
      }
      res.send({ status: 'success', output: stdout });
    });
  });

  server.get('/read-config', async (req, res) => {
    const configPath = path.join(__dirname, 'fossil.conf');
    fs.readFile(configPath, 'utf8', (err, data) => {
      if (err) {
        return res.status(500).send({ status: 'error', message: 'Failed to read configuration file' });
      }
      const config = data.split('\n').filter(line => line.includes('==')).reduce((acc, line) => {
        const [key, value] = line.split('==');
        acc[key.trim()] = value.trim();
        return acc;
      }, {});
      res.send({ status: 'success', configuration: config });
    });
  });

  // Default handle for all other routes
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
