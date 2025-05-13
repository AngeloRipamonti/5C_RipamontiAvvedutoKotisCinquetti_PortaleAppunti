const htmlPdf = require('html-pdf');
const path = require('path');
const [html, filename] = process.argv.slice(2);

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
    if (err) {
        console.log(err);
        process.exit(1);   
    }
    console.log(`/dist/assets/pdf/${filename}`);
    process.exit(0);
});
