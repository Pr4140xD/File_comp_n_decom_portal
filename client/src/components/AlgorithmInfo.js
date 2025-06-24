import React from 'react';

function AlgorithmInfo({ algorithm }) {
  const info = {
    gzip: 'GZIP combines LZ77 and Huffman coding. Most widely supported, excellent for text files.',
    deflate: 'DEFLATE uses LZ77 + Huffman. Standard compression format used in ZIP files.',
    brotli: 'BROTLI is a modern algorithm with better compression ratios than GZIP.',
    auto: 'Algorithm will be automatically detected from the compressed file format.'
  };

  return (
    <div className="alert alert-info mb-3">
      <strong>ℹ️ About {algorithm.toUpperCase()}: </strong>
      {info[algorithm] || 'Select an algorithm to see information.'}
    </div>
  );
}

export default AlgorithmInfo;
