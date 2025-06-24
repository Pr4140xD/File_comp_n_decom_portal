const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { promisify } = require('util');

const gzipAsync = promisify(zlib.gzip);
const gunzipAsync = promisify(zlib.gunzip);
const deflateAsync = promisify(zlib.deflate);
const inflateAsync = promisify(zlib.inflate);
const brotliCompressAsync = promisify(zlib.brotliCompress);
const brotliDecompressAsync = promisify(zlib.brotliDecompress);

const app = express();
app.use(cors());
app.use(express.json());

const uploadsDir = path.join(__dirname, 'uploads');
const processedDir = path.join(__dirname, 'processed');
[uploadsDir, processedDir].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (req, file, cb) => {
    const sanitized = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_').substring(0, 30);
    cb(null, `${Date.now()}_${sanitized}`);
  }
});
const upload = multer({ storage });

const algorithms = {
  gzip: {
    compress: async (buffer) => {
      const compressed = await gzipAsync(buffer, { level: 9 });
      return {
        output: compressed,
        stats: {
          algorithm: 'GZIP',
          originalSize: buffer.length,
          compressedSize: compressed.length,
          ratio: (compressed.length / buffer.length).toFixed(4),
          savings: `${((1 - compressed.length / buffer.length) * 100).toFixed(1)}%`
        }
      };
    },
    decompress: async (buffer) => {
      const decompressed = await gunzipAsync(buffer);
      return {
        output: decompressed,
        stats: {
          algorithm: 'GZIP',
          compressedSize: buffer.length,
          decompressedSize: decompressed.length
        }
      };
    }
  },
  deflate: {
    compress: async (buffer) => {
      const compressed = await deflateAsync(buffer, { level: 9 });
      return {
        output: compressed,
        stats: {
          algorithm: 'DEFLATE',
          originalSize: buffer.length,
          compressedSize: compressed.length,
          ratio: (compressed.length / buffer.length).toFixed(4),
          savings: `${((1 - compressed.length / buffer.length) * 100).toFixed(1)}%`
        }
      };
    },
    decompress: async (buffer) => {
      const decompressed = await inflateAsync(buffer);
      return {
        output: decompressed,
        stats: {
          algorithm: 'DEFLATE',
          compressedSize: buffer.length,
          decompressedSize: decompressed.length
        }
      };
    }
  },
  brotli: {
    compress: async (buffer) => {
      const compressed = await brotliCompressAsync(buffer, {
        params: {
          [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
          [zlib.constants.BROTLI_PARAM_SIZE_HINT]: buffer.length
        }
      });
      return {
        output: compressed,
        stats: {
          algorithm: 'BROTLI',
          originalSize: buffer.length,
          compressedSize: compressed.length,
          ratio: (compressed.length / buffer.length).toFixed(4),
          savings: `${((1 - compressed.length / buffer.length) * 100).toFixed(1)}%`
        }
      };
    },
    decompress: async (buffer) => {
      const decompressed = await brotliDecompressAsync(buffer);
      return {
        output: decompressed,
        stats: {
          algorithm: 'BROTLI',
          compressedSize: buffer.length,
          decompressedSize: decompressed.length
        }
      };
    }
  }
};

app.get('/', (req, res) => {
  res.json({ 
    message: 'Compression Portal API',
    algorithms: Object.keys(algorithms),
    endpoints: ['/api/compress', '/api/decompress', '/api/download']
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK',
    algorithms: Object.keys(algorithms),
    time: new Date().toISOString()
  });
});

app.post('/api/compress', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) throw new Error('No file uploaded');
    const { algorithm = 'gzip' } = req.body;
    if (!algorithms[algorithm]) {
      throw new Error(`Invalid algorithm: ${algorithm}. Available: ${Object.keys(algorithms).join(', ')}`);
    }
    const fileBuffer = fs.readFileSync(req.file.path);
    const result = await algorithms[algorithm].compress(fileBuffer);
    const baseName = path.parse(req.file.originalname).name.substring(0, 20);
    const outFileName = `${baseName}_compressed.${algorithm}`;
    const outPath = path.join(processedDir, outFileName);
    fs.writeFileSync(outPath, result.output);
    fs.unlinkSync(req.file.path); // Cleanup upload
    res.json({
      success: true,
      downloadFileName: outFileName,
      mode: 'compress',
      ...result.stats
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

app.post('/api/decompress', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) throw new Error('No file uploaded');
    const fileBuffer = fs.readFileSync(req.file.path);
    const fileName = req.file.originalname;
    let algorithm;
    if (fileName.includes('.gzip')) algorithm = 'gzip';
    else if (fileName.includes('.deflate')) algorithm = 'deflate';
    else if (fileName.includes('.brotli')) algorithm = 'brotli';
    else throw new Error('Cannot detect algorithm. File must contain .gzip, .deflate, or .brotli in name');
    const result = await algorithms[algorithm].decompress(fileBuffer);
    const baseName = fileName.replace(/\.(gzip|deflate|brotli)$/, '');
    const outFileName = `${baseName}_decompressed.txt`;
    const outPath = path.join(processedDir, outFileName);
    fs.writeFileSync(outPath, result.output);
    fs.unlinkSync(req.file.path); // Cleanup upload
    res.json({
      success: true,
      downloadFileName: outFileName,
      mode: 'decompress',
      ...result.stats
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

app.get('/api/download', (req, res) => {
  try {
    const fileName = req.query.file;
    if (!fileName) throw new Error('Filename required');
    const filePath = path.join(processedDir, fileName);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ 
        success: false, 
        error: `File not found: ${fileName}` 
      });
    }
    res.download(filePath, fileName, (err) => {
      if (!err) {
        setTimeout(() => {
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }, 2000);
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log('\n' + '='.repeat(60));
  console.log('🚀 COMPRESSION PORTAL SERVER STARTED');
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`📦 Algorithms: ${Object.keys(algorithms).join(', ').toUpperCase()}`);
  console.log(`📁 Uploads: ${uploadsDir}`);
  console.log(`📁 Processed: ${processedDir}`);
  console.log('='.repeat(60) + '\n');
});
