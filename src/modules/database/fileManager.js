const path = require('path');
const fs = require('fs');
const htmlDocx = require('html-to-docx');
const mammoth = require("mammoth");
const TurndownService = require('turndown')
let turndownPluginGfm = require('turndown-plugin-gfm')
const { spawn } = require('child_process');

module.exports = function fileManager() {
    if (!fs.existsSync(`${process.cwd()}/dist/assets/docx`)) fs.mkdirSync(`${process.cwd()}/dist/assets/docx`, { recursive: true });
    if (!fs.existsSync(`${process.cwd()}/dist/assets/pdf`)) fs.mkdirSync(`${process.cwd()}/dist/assets/pdf`, { recursive: true });
    if (!fs.existsSync(`${process.cwd()}/dist/assets/md`)) fs.mkdirSync(`${process.cwd()}/dist/assets/md`, { recursive: true });
    if (!fs.existsSync(`${process.cwd()}/dist/assets/images`)) fs.mkdirSync(`${process.cwd()}/dist/assets/images`, { recursive: true });

    let gfm = turndownPluginGfm.gfm
    let turndownService = new TurndownService()
    turndownService.use(gfm)
    turndownService.addRule('strikethrough', {
        filter: ['del', 's', 'strike'],
        replacement: function (content) {
            return '~~' + content + '~~'
        }
    })
    turndownService.addRule('underline', {
        filter: ['u'],
        replacement: function (content) {
            return '<u>' + content + '</u>'
        }
    })

    return {
        saveWord: function (fileData, fileName) {
            const bufferData = Buffer.from(fileData);
            fileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
            fs.writeFileSync(path.join(process.cwd(), `/dist/assets/docx/${fileName}`), bufferData);
            return `/dist/assets/docx/${fileName}`;
        },
        saveInMd: function (html, filename) {
            fs.writeFileSync(path.join(process.cwd(), `/dist/assets/md/${filename}`), turndownService.turndown(html));
            return `/dist/assets/md/${filename}`;
        },
        saveInDocx: async function (html, filename) {
            const docxBuffer = await htmlDocx(html);
            fs.writeFileSync(path.join(process.cwd(), `/dist/assets/docx/${filename}`), docxBuffer);
            return `/dist/assets/docx/${filename}`;
        },
        saveInPdf: function (html, filename) {
            return new Promise((resolve, reject) => {
                const child = spawn('node', [path.join(process.cwd(), "service/pdfExporter.js"), html, filename]);
                let result;
                child.stderr.on('data', (data) => {
                    console.log(data);
                    reject(data);
                });

                child.on('close', (code) => {
                    console.log(code)
                    resolve(result);
                });

                child.stdout.on('data', (data) => {
                    console.log(data);
                    result = data.toString().trim();
                });
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