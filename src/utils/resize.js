import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

const resizeImage = async (sourcePath, destinationPath) => {
    try {
        await sharp(sourcePath)
            .resize(680, 420)
            .toFile(destinationPath);
        console.log(`Resized ${path.basename(sourcePath)} to 680x420px`);
    } catch (err) {
        console.error(`Error resizing file ${path.basename(sourcePath)}`, err);
    }
};

const processImages = async (source, destination) => {
    if (source === destination) {
        console.error("Source and destination directories must be different.");
        return;
    }

    try {
        // Ensure destination directory exists
        await fs.mkdir(destination, { recursive: true });

        const files = await fs.readdir(source);
        for (let file of files) {
            // Check if the file is an image based on its extension
            if (file.match(/\.(jpg|jpeg|png|gif)$/i)) {
                const sourcePath = path.join(source, file);
                const destinationPath = path.join(destination, file);

                console.log(`Processing ${sourcePath}`);
                await resizeImage(sourcePath, destinationPath);
            } else {
                console.log(`Skipping non-image file: ${file}`);
            }
        }
    } catch (err) {
        console.error("Could not process directory.", err);
    }
};

const [source, destination] = process.argv.slice(2);
if (!source || !destination || source === destination) {
    console.error("Usage: node resize.js <source_directory> <destination_directory>");
    process.exit(1);
}

processImages(source, destination);
