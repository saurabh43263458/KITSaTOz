/**
 * Image compression and resizing utility for browser-side optimization.
 * Ensures uploaded images are automatically resized and compressed to fit
 * comfortably below the 1MB Firestore document limit (~200KB - 750KB).
 */

/**
 * Compresses an image file using HTML5 Canvas.
 * 
 * @param {File} file - The uploaded image file
 * @param {Object} options
 * @param {number} options.maxDimension - Maximum width or height in px (default 1280)
 * @param {number} options.targetMaxBytes - Target maximum size in bytes (default 750KB, well under 1MB)
 * @returns {Promise<{ dataUrl: string, sizeBytes: number, originalSize: number, width: number, height: number, wasCompressed: boolean }>}
 */
export const compressImageFile = (file, options = {}) => {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      return reject(new Error('Selected file is not a supported image.'));
    }

    const maxDimension = options.maxDimension || 1280;
    const targetMaxBytes = options.targetMaxBytes || 750 * 1024; // 750 KB safe margin for 1MB doc

    const reader = new FileReader();

    reader.onerror = () => reject(new Error('Failed to read image file.'));

    reader.onload = (readerEvent) => {
      const img = new Image();

      img.onerror = () => reject(new Error('Failed to decode image.'));

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate aspect-ratio-preserved bounding box
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        // Fill white background for transparent PNGs converted to JPEG
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);

        // Draw image onto canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Iterative compression starting at quality 0.85
        let quality = 0.85;
        let dataUrl = canvas.toDataURL('image/jpeg', quality);
        let byteSize = Math.round((dataUrl.length * 3) / 4);

        // If still over target, reduce quality and optionally downscale
        let attempts = 0;
        while (byteSize > targetMaxBytes && attempts < 6) {
          attempts++;
          quality -= 0.12;
          if (quality < 0.4) {
            // Further downscale canvas if quality alone isn't enough
            const tempCanvas = document.createElement('canvas');
            width = Math.round(width * 0.8);
            height = Math.round(height * 0.8);
            tempCanvas.width = width;
            tempCanvas.height = height;
            const tempCtx = tempCanvas.getContext('2d');
            tempCtx.fillStyle = '#FFFFFF';
            tempCtx.fillRect(0, 0, width, height);
            tempCtx.drawImage(canvas, 0, 0, width, height);
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(tempCanvas, 0, 0);
            quality = 0.7;
          }
          dataUrl = canvas.toDataURL('image/jpeg', Math.max(0.3, quality));
          byteSize = Math.round((dataUrl.length * 3) / 4);
        }

        resolve({
          dataUrl,
          sizeBytes: byteSize,
          originalSize: file.size,
          width,
          height,
          wasCompressed: file.size > targetMaxBytes || byteSize < file.size
        });
      };

      img.src = readerEvent.target.result;
    };

    reader.readAsDataURL(file);
  });
};

/**
 * Format bytes into human readable string (KB, MB)
 */
export const formatBytes = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};
