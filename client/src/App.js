import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import AlgorithmSelect from './components/AlgorithmSelect';
import CompressionStats from './components/CompressionStats';
import AlgorithmInfo from './components/AlgorithmInfo';

function App() {
  const [file, setFile] = useState(null);
  const [algorithm, setAlgorithm] = useState('gzip');
  const [stats, setStats] = useState(null);
  const [downloadFileName, setDownloadFileName] = useState('');
  const [mode, setMode] = useState('compress');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleProcess = async () => {
    if (!file) {
      alert('Please select a file first');
      return;
    }
    setProcessing(true);
    setStats(null);
    setDownloadFileName('');
    setError('');
    const formData = new FormData();
    formData.append('file', file);
    if (mode === 'compress') {
      formData.append('algorithm', algorithm);
    }
    const endpoint = mode === 'compress' ? 'compress' : 'decompress';
    try {
      const response = await fetch(`http://localhost:5000/api/${endpoint}`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setStats(data);
        setDownloadFileName(data.downloadFileName); // <-- Use exactly what backend returns!
      } else {
        setError(data.error || 'Processing failed');
      }
    } catch (error) {
      setError(`Connection failed: ${error.message}`);
    }
    setProcessing(false);
  };

  const handleDownload = () => {
    if (!downloadFileName) return;
    window.open(`http://localhost:5000/api/download?file=${encodeURIComponent(downloadFileName)}`, '_blank');
    setDownloadFileName('');
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <h1 className="text-center mb-4 text-primary">
            🗜️ Data Compression Portal
          </h1>
          <p className="text-center text-muted mb-4">
            Built-in Node.js Algorithms: GZIP, DEFLATE, BROTLI
          </p>
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          <div className="btn-group mb-4 w-100" role="group">
            <button
              className={`btn ${mode === 'compress' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setMode('compress')}
              disabled={processing}
            >
              📦 Compress
            </button>
            <button
              className={`btn ${mode === 'decompress' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setMode('decompress')}
              disabled={processing}
            >
              📂 Decompress
            </button>
          </div>
          {mode === 'compress' && (
            <AlgorithmSelect algorithm={algorithm} setAlgorithm={setAlgorithm} />
          )}
          <AlgorithmInfo algorithm={mode === 'compress' ? algorithm : 'auto'} />
          <FileUpload setFile={setFile} file={file} mode={mode} />
          <div className="d-grid mb-4">
            <button
              className="btn btn-warning btn-lg"
              onClick={handleProcess}
              disabled={processing || !file}
            >
              {processing ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Processing...
                </>
              ) : (
                `🚀 ${mode === 'compress' ? 'Compress' : 'Decompress'} File`
              )}
            </button>
          </div>
          {stats && <CompressionStats stats={stats} />}
          {downloadFileName && (
            <div className="d-grid mb-4">
              <button
                className="btn btn-success btn-lg"
                onClick={handleDownload}
              >
                📥 Download {mode === 'compress' ? 'Compressed' : 'Decompressed'} File
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
