const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

module.exports = function fileManager() {
    if (!fs.existsSync(`${process.cwd()}/dist/assets/docx`)) fs.mkdirSync(`${process.cwd()}/dist/assets/docx`, { recursive: true });
    if (!fs.existsSync(`${process.cwd()}/dist/assets/pdf`)) fs.mkdirSync(`${process.cwd()}/dist/assets/pdf`, { recursive: true });
    if (!fs.existsSync(`${process.cwd()}/dist/assets/md`)) fs.mkdirSync(`${process.cwd()}/dist/assets/md`, { recursive: true });
    if (!fs.existsSync(`${process.cwd()}/dist/assets/images`)) fs.mkdirSync(`${process.cwd()}/dist/assets/images`, { recursive: true });
    if (!fs.existsSync(`${process.cwd()}/dist/assets/html`)) fs.mkdirSync(`${process.cwd()}/dist/assets/pdf`, { recursive: true });

    function htmlToMarkdown(input, output) {
        return new Promise((resolve, reject) => {
            const command = `pandoc -f html -t markdown "${input}" -o "${output}"`;

            exec(command, (error, stdout, stderr) => {
                if (error) {
                    reject(`Errore nella conversione HTML a Markdown: ${error.message}`);
                    return;
                }
                if (stderr) {
                    console.warn(`Warning: ${stderr}`);
                }
                resolve(output);
            });
        });
    };

    function markdownToWord(input, output) {
        return new Promise((resolve, reject) => {
            const command = `pandoc -f markdown -t docx "${input}" -o "${output}"`;

            exec(command, (error, stdout, stderr) => {
                if (error) {
                    reject(`Errore nella conversione Markdown a Word: ${error.message}`);
                    return;
                }
                if (stderr) {
                    console.warn(`Warning: ${stderr}`);
                }
                resolve(output);
            });
        });
    };

    function markdownToPdf(input, output) {
        return new Promise((resolve, reject) => {
            const command = `pandoc "${input}" -o "${output}" --pdf-engine=wkhtmltopdf || pandoc "${input}" -o "${output}" --pdf-engine=xelatex || pandoc "${input}" -o "${output}" --pdf-engine=weasyprint`;

            exec(command, (error, stdout, stderr) => {
                if (error) {
                    reject(`Errore nella conversione Markdown a PDF: ${error.message}\n\nPer favore installa uno dei seguenti motori PDF:\n1. wkhtmltopdf (consigliato): sudo apt-get install wkhtmltopdf\n2. xelatex: sudo apt-get install texlive-xetex\n3. weasyprint: pip install weasyprint`);
                    return;
                }
                if (stderr) {
                    console.warn(`Warning: ${stderr}`);
                }
                resolve(output);
            });
        });
    };

    function wordToMarkdown(input, output) {
        return new Promise((resolve, reject) => {
            if (!fs.existsSync(input)) {
                reject(`Il file "${input}" non esiste o non è accessibile`);
                return;
            }

            const absolutePath = path.resolve(input);
            console.log(`Convertendo file Word da: ${absolutePath}`);

            const command = `pandoc -f docx -t markdown "${absolutePath}" -o "${output}"`;

            exec(command, (error, stdout, stderr) => {
                if (error) {
                    reject(`Errore nella conversione Word a Markdown: ${error.message}\n\nVerifica che il file sia un documento Word valido (.docx)`);
                    return;
                }
                if (stderr) {
                    console.warn(`Warning: ${stderr}`);
                }
                resolve(output);
            });
        });
    };

    function markdownToHtml(input, output) {
        return new Promise((resolve, reject) => {
            const command = `pandoc -f markdown -t html "${input}" -o "${output}"`;

            exec(command, (error, stdout, stderr) => {
                if (error) {
                    reject(`Errore nella conversione Markdown a HTML: ${error.message}`);
                    return;
                }
                if (stderr) {
                    console.warn(`Warning: ${stderr}`);
                }
                resolve(output);
            });
        });
    };

    async function wordToMarkdownToHtml(input, outputMd, outputHtml) {
        try {
            await wordToMarkdown(input, outputMd);
            await markdownToHtml(outputMd, outputHtml);
            return outputHtml;
        } catch (error) {
            throw error;
        }
    };

    function saveToTempFile(content, extension) {
        return new Promise((resolve, reject) => {
            const tempDir = path.join(process.cwd(), 'temp');

            if (!fs.existsSync(tempDir)) {
                fs.mkdirSync(tempDir, { recursive: true });
            }

            const tempFile = path.join(tempDir, `temp_${Date.now()}.${extension}`);

            fs.writeFile(tempFile, content, (err) => {
                if (err) {
                    reject(`Errore nel salvare il file temporaneo: ${err.message}`);
                    return;
                }
                resolve(tempFile);
            });
        });
    };

    function isFilePath(input) {
        try {
            return fs.existsSync(input) && fs.statSync(input).isFile();
        } catch (error) {
            return false;
        }
    };

    function getInputContent(input, inputType) {
        return new Promise((resolve, reject) => {
            let inputPath = input;
            if (!path.isAbsolute(input)) {
                inputPath = path.resolve(process.cwd(), input);
            }

            if (fs.existsSync(inputPath) && fs.statSync(inputPath).isFile()) {
                console.log(`File trovato: ${inputPath}`);
                resolve({ isFile: true, content: null, path: inputPath });
            } else {
                console.log(`Input non trovato come file. Trattato come contenuto diretto.`);
                resolve({ isFile: false, content: input });
            }
        });
    };

    async function markdownToHtmlContent(input) {
        try {
            const tempOutput = await saveToTempFile('', 'html'); 
            const command = `pandoc -f markdown -t html "${input}" -o "${tempOutput}"`;
    
            return new Promise((resolve, reject) => {
                exec(command, (error, stdout, stderr) => {
                    if (error) {
                        reject(`Errore nella conversione Markdown a HTML: ${error.message}`);
                        return;
                    }
    
                    if (stderr) {
                        console.warn(`Warning: ${stderr}`);
                    }
    
                    fs.readFile(tempOutput, 'utf8', (readErr, data) => {
                        if (readErr) {
                            reject(`Errore nella lettura del file HTML generato: ${readErr.message}`);
                            return;
                        }
    
                        resolve(data);
                    });
                });
            });
        } catch (err) {
            throw new Error(`Errore nella generazione del file HTML temporaneo: ${err.message}`);
        }
    }
    

    return {
        checkDependencies: function () {
            return new Promise((resolve, reject) => {
                console.log('Verificando le dipendenze...');

                exec('pandoc --version', (error) => {
                    if (error) {
                        reject('Pandoc non è installato. Per favore, installalo da https://pandoc.org/installing.html');
                        return;
                    }

                    const pdfEngines = [
                        { name: 'pdflatex', package: 'texlive-latex-base' },
                        { name: 'xelatex', package: 'texlive-xetex' },
                        { name: 'wkhtmltopdf', package: 'wkhtmltopdf' },
                        { name: 'weasyprint', package: 'weasyprint (via pip)' }
                    ];

                    let pdfEngineFound = false;
                    let enginesChecked = 0;

                    pdfEngines.forEach(engine => {
                        exec(`which ${engine.name}`, (error) => {
                            enginesChecked++;

                            if (!error) {
                                pdfEngineFound = true;
                                console.log(`✓ ${engine.name} trovato (necessario per la conversione PDF)`);
                            }

                            if (enginesChecked === pdfEngines.length) {
                                if (!pdfEngineFound) {
                                    console.warn('\n⚠️  Nessun motore PDF trovato! La conversione in PDF potrebbe fallire.');
                                    console.warn('   Per convertire in PDF, installa uno dei seguenti:');
                                    pdfEngines.forEach(eng => {
                                        console.warn(`   - ${eng.name}: sudo apt-get install ${eng.package}`);
                                    });
                                    console.warn('');
                                }

                                resolve();
                            }
                        });
                    });
                });
            });
        },
        menu: async function (option, input, output) {
            try {
                option = parseInt(option.trim());

                if (![1, 2, 3, 4, 5].includes(option)) {
                    console.error('Opzione non valida. FileManager');
                    return;
                }

                const conversionTypes = ['HTML', 'Markdown', 'Markdown', 'Word'];
                const inputType = conversionTypes[option - 1];

                input = input.trim();
                const inputInfo = await getInputContent(input, inputType);

                output = output.trim();

                const outputDir = path.dirname(output);
                if (!fs.existsSync(outputDir)) {
                    fs.mkdirSync(outputDir, { recursive: true });
                }

                let inputPath = inputInfo.path;

                if (!inputInfo.isFile) {
                    const extensions = ['html', 'md', 'md', 'docx'];
                    const extension = extensions[option - 1];
                    inputPath = await saveToTempFile(inputInfo.content, extension);
                    console.log(`File temporaneo creato in: ${inputPath}`);
                }

                console.log('\nConversione in corso...');

                switch (option) {
                    case 1:
                        await htmlToMarkdown(inputPath, path.join(process.cwd(), "/dist/assets/md", output));
                        return output;
                        break;
                    case 2:
                        await markdownToWord(inputPath, path.join(process.cwd(), "/dist/assets/docx", output));
                        return output;
                        break;
                    case 3:
                        await markdownToPdf(inputPath, path.join(process.cwd(), "/dist/assets/pdf", output));
                        return output;
                        break;
                    case 4:
                        const outputHtml = output.endsWith('.html') ? path.join(process.cwd(), "/dist/assets/html", output) : path.join(process.cwd(), "/dist/assets/html", `${output}.html`);
                        const outputMd = output.endsWith('.html') ? path.join(process.cwd(), "/dist/assets/md", output.replace('.html', '.md')) : path.join(process.cwd(), "/dist/assets/md", `${output}.md`);

                        console.log(`Convertendo da Word a Markdown (${inputPath} -> ${outputMd})...`);
                        await wordToMarkdown(inputPath, outputMd);

                        console.log(`Convertendo da Markdown a HTML (${outputMd} -> ${outputHtml})...`);
                        await markdownToHtml(outputMd, outputHtml);

                        console.log(`File Markdown intermedio salvato in: ${outputMd}`);
                        console.log(`File HTML finale salvato in: ${outputHtml}`);
                        return this.menu(5,outputHtml);
                        break;
                    case 5:
                        const htmlText = await markdownToHtmlContent(inputPath);
                        const outputHtmlPath = path.join(process.cwd(), "/dist/assets/html", output.endsWith('.html') ? output : `${output}.html`);
                        fs.writeFileSync(outputHtmlPath, htmlText, 'utf8');
                        console.log(`Contenuto HTML scritto in: ${outputHtmlPath}`);
                        console.log('\nContenuto HTML:\n');
                        console.log(htmlText);
                        return htmlText;
                        break;
                        
                }

                console.log(`\nConversione completata!`);
            } catch (error) {
                console.error(`\nErrore: ${error}`);
            }
        },
        saveImage: function (fileData, fileName) {
            const base64 = fileData.split(',')[1];
            const bufferData = Buffer.from(base64, 'base64');
            fileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
            fs.writeFileSync(path.join(process.cwd(), `/dist/assets/images/${fileName}`), bufferData);
            return `/dist/assets/images/${fileName}`;
        }
    }
}