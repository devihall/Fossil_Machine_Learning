import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

const resizeImage = async (sourcePath, destinationPath, width, height) => {
    console.log(`Resizing ${path.basename(sourcePath)} to ${width}x${height}px`);
    try {
        await sharp(sourcePath)
            .resize(parseInt(width), parseInt(height))
            .withMetadata({ density: 72 }) // Set the DPI to 72
            .toFile(destinationPath);
        console.log(`Resized ${path.basename(sourcePath)} to ${width}x${height}px`);
    } catch (err) {
        console.error(`Error resizing file ${path.basename(sourcePath)}`, err);
    }
};

const processImages = async (source, destination, width, height) => {
    try {
        // Ensure destination directory exists
        await fs.mkdir(destination, { recursive: true });

        const files = await fs.readdir(source);
        for (let file of files) {
            if (file.match(/\.(jpg|jpeg|png|gif)$/i)) {
                const sourcePath = path.join(source, file);
                const destinationPath = path.join(destination, file);

                console.log(`Processing ${sourcePath}`);
                await resizeImage(sourcePath, destinationPath, width, height);
            } else {
                console.log(`Skipping non-image file: ${file}`);
            }
        }
    } catch (err) {
        console.error("Could not process directory.", err);
    }
};

const [source, destination, width, height] = process.argv.slice(2);
if (!source || !destination || !width || !height) {
    console.error("Usage: node resize.js <source_directory> <destination_directory> <width> <height>");
    process.exit(1);
}

processImages(source, destination, width, height);
