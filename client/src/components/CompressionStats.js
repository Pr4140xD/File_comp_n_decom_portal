import React from 'react';

function CompressionStats({ stats }) {
  return (
    <div className="card mb-4">
      <div className="card-header bg-success text-white">
        <h5 className="mb-0">
          📊 {stats.mode === 'compress' ? 'Compression' : 'Decompression'} Results
        </h5>
      </div>
      <div className="card-body">
        <div className="row">
          {stats.originalSize && (
            <div className="col-md-6 mb-3">
              <div className="text-center">
                <div className="fs-4 text-primary">{stats.originalSize.toLocaleString()}</div>
                <small className="text-muted">Original Size (bytes)</small>
              </div>
            </div>
          )}
          
          {stats.compressedSize && (
            <div className="col-md-6 mb-3">
              <div className="text-center">
                <div className="fs-4 text-success">{stats.compressedSize.toLocaleString()}</div>
                <small className="text-muted">Compressed Size (bytes)</small>
              </div>
            </div>
          )}
          
          {stats.decompressedSize && (
            <div className="col-md-6 mb-3">
              <div className="text-center">
                <div className="fs-4 text-info">{stats.decompressedSize.toLocaleString()}</div>
                <small className="text-muted">Decompressed Size (bytes)</small>
              </div>
            </div>
          )}
          
          {stats.ratio && (
            <div className="col-md-6 mb-3">
              <div className="text-center">
                <div className="fs-4 text-warning">{stats.ratio}</div>
                <small className="text-muted">Compression Ratio</small>
              </div>
            </div>
          )}
          
          {stats.savings && (
            <div className="col-md-6 mb-3">
              <div className="text-center">
                <div className="fs-4 text-success">{stats.savings}</div>
                <small className="text-muted">Space Saved</small>
              </div>
            </div>
          )}
          
          <div className="col-md-6 mb-3">
            <div className="text-center">
              <div className="fs-5 text-info">{stats.algorithm}</div>
              <small className="text-muted">Algorithm Used</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompressionStats;
