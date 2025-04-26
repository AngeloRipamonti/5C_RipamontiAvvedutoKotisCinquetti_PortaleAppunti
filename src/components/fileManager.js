const path = require('path');
const fs = require('fs');
const htmlDocx = require('html-to-docx');
const htmlPdf = require('html-pdf');

module.exports = function fileManager() {
    if (!fs.existsSync(`${process.cwd()}/dist/assets/docx`)) fs.mkdirSync(`${process.cwd()}/dist/assets/docx`, { recursive: true });
    if (!fs.existsSync(`${process.cwd()}/dist/assets/pdf`)) fs.mkdirSync(`${process.cwd()}/dist/assets/pdf`, { recursive: true });
    if (!fs.existsSync(`${process.cwd()}/dist/assets/md`)) fs.mkdirSync(`${process.cwd()}/dist/assets/md`, { recursive: true });

    return {
        saveInMd: function (html, filename) {
            fs.writeFileSync(path.join(process.cwd(), `/dist/assets/md/${filename}`), html);
        },
        saveInDocx: async function (html, filename) {
            const docxBuffer = await htmlDocx(html);
            fs.writeFileSync(path.join(process.cwd(), `/dist/assets/docx/${filename}`), docxBuffer);
            return path.join(process.cwd(), `/dist/assets/docx/${filename}`);
        },
        saveInPdf: async function (html, filename){
            htmlPdf.create(html, {
                format: 'A4',
                border: {
                    top: '10mm',
                    right: '10mm',
                    bottom: '10mm',
                    left: '10mm'
                }
            })
            .toFile(path.join(process.cwd(), `/dist/assets/pdf/${filename}`), (err, res) => {
                if (err) throw err; 
                return path.join(process.cwd(), `/dist/assets/pdf/${filename}`);
            });
        }
    }
}