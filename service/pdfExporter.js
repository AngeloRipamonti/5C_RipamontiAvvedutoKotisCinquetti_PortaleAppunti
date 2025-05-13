const wkhtmltopdf = require('wkhtmltopdf');
const fs = require('fs');
const path = require('path');
const [html, filename] = process.argv.slice(2);

wkhtmltopdf(html, { pageSize: 'A4' })
    .pipe(fs.createWriteStream(path.join(process.cwd(), 'dist/assets/pdf', filename)))
    .on('finish', () => {
        console.log(`/dist/assets/pdf/${filename}`);
        process.exit(0);
    })
    .on('error', (err) => {
        console.log(err);
        process.exit(1);
    });
