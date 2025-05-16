const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

module.exports = function fileManager() {
    const ensureDir = (dirPath) => {
        if (!fs.existsSync(dirPath)) fs.mkdirSync(path.join(process.cwd(), dirPath), { recursive: true });
    };

    const assets = {
        docx: path.join('dist/assets/docx'),
        pdf: path.join('dist/assets/pdf'),
        html: path.join('dist/assets/html'),
        temp: path.join('temp'),
        img: path.join("dist/assets/images")
    };

    Object.values(assets).forEach(ensureDir);

    const execCommand = (command) => {
        return new Promise((resolve, reject) => {
            exec(command, (error, stdout, stderr) => {
                if (error) return reject(error.message);
                if (stderr) console.warn(`Warning: ${stderr}`);
                resolve(stdout);
            });
        });
    };

    return {
        mdToDocx: async function(inputPath){
            const oPath = path.join(assets.docx, `${path.basename(inputPath, '.md')}.docx`)
            const outputPath = path.join(process.cwd(), oPath);
            await execCommand(`pandoc -f markdown -t docx "${inputPath}" -o "${outputPath}"`);
            return oPath;
        },
        mdToPdf: async function(inputPath){
            const oPath = path.join(assets.pdf, `${path.basename(inputPath, '.md')}.pdf`)
            const outputPath = path.join(assets.pdf, oPath);
            await execCommand(`pandoc "${inputPath}" -o "${outputPath}" --pdf-engine=wkhtmltopdf`);
            return outputPath;
        },
        mdToHtml: async function(inputPath){
            const tempOutput = path.join(assets.temp, `temp_${Date.now()}.html`);
            await execCommand(`pandoc -f markdown -t html "${inputPath}" -o "${tempOutput}"`);
            return fs.readFileSync(tempOutput, 'utf8');
        },
        docxToHtml: async function(fileData, fileName){
            const bufferData = Buffer.from(fileData);
            fileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
            const oPath = path.join(assets.temp, `temp_${Date.now()}.md`)
            const outputPath = path.join(process.cwd(), oPath);
            fs.writeFileSync(outputPath, bufferData);
            console.log("1 step")
            const tempMd = path.join(assets.md, `${fileName}.md`);
            const tempHtml = path.join(assets.temp, `temp_${Date.now()}.html`);
            await execCommand(`pandoc -f docx -t markdown "${outputPath}" -o "${tempMd}"`).catch((err) => {
                console.log(err);
            });
            await execCommand(`pandoc -f markdown -t html "${tempMd}" -o "${tempHtml}"`).catch((err) => {
                console.log(err);
            });
            console.log("2 step")
            const text = fs.readFileSync(tempHtml, 'utf8');
            return {path_note: tempMd, text}
        },
        htmlToMd: async function(htmlContent, output){
            const tempHtml = path.join(assets.temp, `temp_${Date.now()}.html`);
            const oPath = path.join(assets.md, output)
            const outputPath = path.join(process.cwd(), oPath);
            fs.writeFileSync(tempHtml, htmlContent, 'utf8');
            await execCommand(`pandoc -f html -t markdown "${tempHtml}" -o "${outputPath}"`);
            return oPath;
        },
        saveImage: function (fileData, fileName) {
            const base64 = fileData.split(',')[1];
            const bufferData = Buffer.from(base64, 'base64');
            fileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
            const oPath = path.join(assets.img, fileName)
            const outputPath = path.join(process.cwd(), oPath);
            fs.writeFileSync(outputPath, bufferData);
            return oPath;
        }
    };
};