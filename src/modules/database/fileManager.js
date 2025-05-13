const path = require('path');
const fs = require('fs');
const htmlDocx = require('html-to-docx');
const mammoth = require("mammoth");
const { spawn } = require('child_process');

module.exports = function fileManager() {
    if (!fs.existsSync(`${process.cwd()}/dist/assets/docx`)) fs.mkdirSync(`${process.cwd()}/dist/assets/docx`, { recursive: true });
    if (!fs.existsSync(`${process.cwd()}/dist/assets/pdf`)) fs.mkdirSync(`${process.cwd()}/dist/assets/pdf`, { recursive: true });
    if (!fs.existsSync(`${process.cwd()}/dist/assets/md`)) fs.mkdirSync(`${process.cwd()}/dist/assets/md`, { recursive: true });
    if (!fs.existsSync(`${process.cwd()}/dist/assets/images`)) fs.mkdirSync(`${process.cwd()}/dist/assets/images`, { recursive: true });

    return {
        saveWord: function (fileData, fileName) {
            const bufferData = Buffer.from(fileData);
            fileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
            fs.writeFileSync(path.join(process.cwd(), `/dist/assets/docx/${fileName}`), bufferData);
            return `/dist/assets/docx/${fileName}`;
        },
        saveInMd: function (html, filename) {
            fs.writeFileSync(path.join(process.cwd(), `/dist/assets/md/${filename}`), html);
            return `/dist/assets/md/${filename}`;
        },
        saveInDocx: async function (html, filename) {
            const docxBuffer = await htmlDocx(html);
            fs.writeFileSync(path.join(process.cwd(), `/dist/assets/docx/${filename}`), docxBuffer);
            return `/dist/assets/docx/${filename}`;
        },
        saveInPdf: async function (html, filename) {
            const child = spawn('node', [path.join(process.cwd(), "service/pdfExporter.js"), html, filename]);

            child.stderr.on('data', (data) => {
                console.error(`Errore: ${data}`);
                throw new Error(data);
            });

            child.on('close', (code) => {
                console.log(`Processo terminato con codice: ${code}`);
            });

            return child.stdout.on('data', (data) => {
                const result = data.toString().trim();
                console.log(`Risultato ottenuto da child: ${result}`);
                return result;
            });


        },
        saveImage: function (fileData, fileName) {
            const base64 = fileData.split(',')[1];
            const bufferData = Buffer.from(base64, 'base64');
            fileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
            fs.writeFileSync(path.join(process.cwd(), `/dist/assets/images/${fileName}`), bufferData);
            return `/dist/assets/images/${fileName}`;
        },
        importFromMd: function (filepath) {
            return fs.readFileSync(path.join(process.cwd(), filepath)).toString();
        },
        importFromDocx: async function (filepath) {
            const result = await mammoth.convertToHtml({ path: path.join(process.cwd(), filepath) }, { styleMap: ["u => u"] });
            return result.value;
        }
    }
}