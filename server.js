import express from 'express';
const app = express();
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const port = 4000;
import { exec } from 'child_process';

app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseImagesDir = path.join(__dirname, 'public', 'images');
const cacheDir = path.join(__dirname, 'public', 'cache');

if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
}

app.get('/image/*', async (req, res) => {
    const imagePath = path.join(baseImagesDir, req.params[0]);
    const width = parseInt(req.query.width, 10) || 680; // Default width
    const height = parseInt(req.query.height, 10) || 680; // Default height
    const cachedImagePath = path.join(cacheDir, `${width}x${height}`, req.params[0]);

    // Check if the cached version exists
    if (fs.existsSync(cachedImagePath)) {
        console.log(`Serving cached image: ${cachedImagePath}`);
        return res.sendFile(cachedImagePath);
    }

    console.log(`Attempting to access image at: ${imagePath}`); 

    if (fs.existsSync(imagePath)) {
        try {
            const resizedImage = await sharp(imagePath)
                .resize(width, height)
                .toBuffer();

            // Create directory for cache if it doesn't exist
            const cachedImageDir = path.dirname(cachedImagePath);
            if (!fs.existsSync(cachedImageDir)) {
                fs.mkdirSync(cachedImageDir, { recursive: true });
            }

            // Save the resized image to cache
            await sharp(resizedImage).toFile(cachedImagePath);

            console.log(`Generated and cached new image: ${cachedImagePath}`);
            res.contentType('image/jpeg');
            res.send(resizedImage);
        } catch (error) {
            console.error('Error processing image:', error);
            res.status(500).send('Error processing image');
        }
    } else {
        console.error(`Image not found at: ${imagePath}`);
        res.status(404).send('Image not found');
    }
});

app.post('/execute-script', (req, res) => {
    const { num } = req.body; 

    exec(`bash ./create-json.sh sharks ${num}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(500).send({ status: 'error', message: `Script execution failed: ${error.message}` });
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);

        res.send({ status: 'success', output: stdout });
    });
});

app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});