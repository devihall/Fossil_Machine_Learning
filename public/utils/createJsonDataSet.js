import fs from 'fs';
import path from 'path';

function createDatasetJson(lastFolderName) {
    const baseDir = path.join('images', 'dataSets', lastFolderName);
    const dataset = [];

    fs.readdir(baseDir, { withFileTypes: true }, (err, categories) => {
        if (err) {
            console.error('Error reading directory:', err);
            return;
        }

        let categoryCount = categories.length;

        categories.forEach((categoryDir) => {
            if (categoryDir.isDirectory()) {
                const categoryPath = path.join(baseDir, categoryDir.name);

                fs.readdir(categoryPath, (err, files) => {
                    if (err) {
                        console.error('Error reading category directory:', err);
                        return;
                    }

                    files.forEach((file) => {
                        const filePath = path.join(categoryPath, file);
                        dataset.push({
                            image: filePath.replace(/\\/g, '/'),  // Ensure forward slashes for paths
                            category: categoryDir.name
                        });
                    });

                    categoryCount--;
                    if (categoryCount === 0) {  // Check if all categories have been processed
                        const jsonFileName = `${lastFolderName}.json`;
                        console.log('WRITTING');
                        fs.writeFile(jsonFileName, JSON.stringify(dataset, null, 4), (err) => {
                            if (err) {
                                console.error('Error writing JSON file:', err);
                                return;
                            }
                            console.log(`${jsonFileName} created with ${dataset.length} entries.`);
                        });
                    }
                });
            } else {
                categoryCount--;
            }
        });
    });
}

module.exports = createDatasetJson;


