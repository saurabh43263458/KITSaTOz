import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage, isFirebaseConfigured } from './firebase';

/**
 * Uploads a local image file directly to Firebase Storage and returns the public download URL.
 * 
 * @param {File} file - The image file selected from the user's computer
 * @param {string} folder - The destination storage folder (defaults to 'products')
 * @returns {Promise<string>} Download URL of the uploaded image
 */
export const uploadImageToFirebase = async (file, folder = 'products') => {
  if (!file) {
    throw new Error('No file provided for upload.');
  }

  // Validate file type
  if (!file.type.startsWith('image/')) {
    throw new Error('Please select an image file (PNG, JPG, WEBP, etc.).');
  }

  // Size limit check: 10MB
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('Image size must be less than 10MB.');
  }

  if (!isFirebaseConfigured || !storage) {
    throw new Error('Firebase Storage is not configured. Please check your Firebase settings.');
  }

  // Clean filename and create unique storage path
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const uniquePath = `${folder}/${Date.now()}_${sanitizedName}`;
  const fileRef = ref(storage, uniquePath);

  const metadata = {
    contentType: file.type,
    customMetadata: {
      originalName: file.name,
      uploadedAt: new Date().toISOString()
    }
  };

  const uploadResult = await uploadBytes(fileRef, file, metadata);
  const downloadUrl = await getDownloadURL(uploadResult.ref);
  return downloadUrl;
};

/**
 * Utility fallback: Convert a local File to Base64 data URL
 */
export const convertFileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};
