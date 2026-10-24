import fs from 'fs';
import path from 'path';
import os from 'os';

const BUCKET = 'kitsatoz-8becc.appspot.com';

function getAccessToken() {
  const configPath = path.join(os.homedir(), '.config', 'configstore', 'firebase-tools.json');
  if (fs.existsSync(configPath)) {
    const data = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    if (data?.tokens?.access_token) {
      return data.tokens.access_token;
    }
  }
  throw new Error('Could not find Firebase access token.');
}

async function uploadFile(localPath, storageFilename, contentType = 'image/jpeg') {
  const token = getAccessToken();
  const fileData = fs.readFileSync(localPath);
  const uploadUrl = `https://firebasestorage.googleapis.com/v0/b/${BUCKET}/o?uploadType=media&name=products%2F${encodeURIComponent(storageFilename)}`;
  
  const res = await fetch(uploadUrl, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': contentType
    },
    body: fileData
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Upload failed for ${storageFilename}: ${res.status} - ${err}`);
  }

  const result = await res.json();
  const downloadUrl = `https://firebasestorage.googleapis.com/v0/b/${BUCKET}/o/products%2F${encodeURIComponent(storageFilename)}?alt=media`;
  console.log(`Uploaded ${storageFilename} -> ${downloadUrl}`);
  return downloadUrl;
}

async function run() {
  try {
    await uploadFile('public/products/image2.jpeg', 'kitsatoz-3d-parts-frame.jpg');
    await uploadFile('public/products/ganesh_image.jpeg', 'ganesh_image.jpeg');
    await uploadFile('public/products/spider_3D.jpeg', 'spider_3D.jpeg');
    console.log("All uploads succeeded!");
  } catch (e) {
    console.error("Upload error:", e);
  }
}

run();
