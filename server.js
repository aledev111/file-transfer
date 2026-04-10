const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();

const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + file.originalname;
        cb(null, uniqueName);
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 * 1024 }  // 2GB
});

if (!fs.existsSync('./uploads')) {
    fs.mkdirSync('./uploads');
}

app.use(express.static('public'));

app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('Nessun file caricato');
    }
    const downloadLink = `http://localhost:3000/download/${req.file.filename}`;
    res.json({ message: 'File caricato!', link: downloadLink });
});

app.get('/download/:filename', (req, res) => {
    const filepath = path.join(__dirname, 'uploads', req.params.filename);
    res.download(filepath);
});

app.listen(3000, () => {
    console.log('✅ Server avviato su http://localhost:3000');
});