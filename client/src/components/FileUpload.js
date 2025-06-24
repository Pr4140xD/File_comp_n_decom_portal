import React from 'react';

function FileUpload({ setFile, file, mode }) {
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <div className="card mb-4">
      <div className="card-body">
        <h5 className="card-title">
          📁 {mode === 'compress' ? 'Select File to Compress' : 'Select Compressed File'}
        </h5>
        <input
          type="file"
          className="form-control"
          onChange={handleFileChange}
          accept={mode === 'compress' ? '*' : '.gzip,.deflate,.brotli'}
        />
        {file && (
          <div className="mt-2">
            <small className="text-muted">
              Selected: <strong>{file.name}</strong> ({(file.size / 1024).toFixed(2)} KB)
            </small>
          </div>
        )}
      </div>
    </div>
  );
}

export default FileUpload;
