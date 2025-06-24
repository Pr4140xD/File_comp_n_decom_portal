import React from 'react';

function AlgorithmSelect({ algorithm, setAlgorithm }) {
  return (
    <div className="card mb-3">
      <div className="card-body">
        <label className="form-label fw-bold">Select Compression Algorithm:</label>
        <select
          className="form-select"
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value)}
        >
          <option value="gzip">GZIP (Most Compatible)</option>
          <option value="deflate">DEFLATE (Standard)</option>
          <option value="brotli">BROTLI (Best Compression)</option>
        </select>
      </div>
    </div>
  );
}

export default AlgorithmSelect;
