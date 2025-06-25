# Deployed File Compression And Decompression Portal 
  ![Screenshot 2025-06-25 225013](https://github.com/user-attachments/assets/6a094391-204a-4fdc-af35-09dd17e9239d)

# MaRS IITR OP Title (PS):---->

A personalized web portal for **both file compression and decompression**, built with **React** (frontend) and **Node.js/Express** (backend), and deployed entirely on **Render** for seamless, reliable access.

##  Features

- **Compress any file** using built-in Node.js algorithms: GZIP, DEFLATE, and BROTLI.
- **Decompress files** back to their original format—restoring full content and extension.
- **Preserves original file types** for easy use after processing.
- **Modern, responsive UI** with React and Bootstrap.
- **Displays live compression and decompression statistics** (original size, compressed size, ratio, savings).
- **Robust error handling** and clear feedback for all operations.

##  Built Process

- **Node.js zlib module** for lossless compression and decompression, leveraging algorithms like Huffman coding and LZ77.
- **Express** for backend API and file handling.
- **Multer** for efficient file uploads.
- **React** for a dynamic, user-friendly frontend.
- **Bootstrap** for responsive, clean styling.
- **Deployment on Render** for both frontend (static site) and backend (web service), ensuring unified and scalable hosting.
- **API integration:** React frontend communicates directly with the backend API on Render.
- **Compression and decompression stats** are calculated and displayed in real time for user insight.

##  How to Run Locally

**Backend:**
cd server
npm install
node app.js

**Frontend:**
cd client
npm install
npm start
## If you Deployment on Render

- **Frontend:** Deployed as a Static Site on Render.  
  - **Build Command:** `npm run build`
  - **Publish Directory:** `build`
- **Backend:** Deployed as a Web Service on Render.  
  - **Start Command:** `node app.js`
  - **Root Directory:** `server` (if using a monorepo)
  
  ![Screenshot 2025-06-25 225057](https://github.com/user-attachments/assets/9162ec24-cf7f-416d-b4d6-0815cd2ab1fa)
  ![Screenshot 2025-06-25 225127](https://github.com/user-attachments/assets/9b0bb9e4-7d7e-4db4-b54b-23789cf289be)


