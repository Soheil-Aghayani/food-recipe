const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ASSETS_DIR = path.join(__dirname, '..', 'assets');

async function walk(dir) {
    let files = await fs.promises.readdir(dir);
    files = await Promise.all(files.map(async file => {
        const filePath = path.join(dir, file);
        const stats = await fs.promises.stat(filePath);
        if (stats.isDirectory()) return walk(filePath);
        else if (stats.isFile()) return filePath;
    }));
    return files.reduce((all, folderContents) => all.concat(folderContents), []);
}

async function optimize() {
    try {
        console.log('Starting asset optimization...');
        const allFiles = await walk(ASSETS_DIR);
        const imageFiles = allFiles.filter(file => /\.(png|jpe?g)$/i.test(file));

        for (const file of imageFiles) {
            const ext = path.extname(file);
            const webpPath = file.replace(ext, '.webp');

            console.log(`Optimizing: ${path.relative(ASSETS_DIR, file)} -> ${path.relative(ASSETS_DIR, webpPath)}`);
            
            await sharp(file)
                .webp({ quality: 80 })
                .toFile(webpPath);
            
            // Optional: Remove original if you want to be aggressive, 
            // but usually it's better to keep it and let the user delete it.
            // fs.unlinkSync(file); 
        }

        console.log('Optimization complete! All images converted to .webp');
    } catch (err) {
        console.error('Error during optimization:', err);
    }
}

optimize();
