import { Base44 } from '@base44/sdk';

// Initialize Base44 client
const base44 = new Base44({
  apiKey: import.meta.env.VITE_BASE44_API_KEY,
  baseUrl: import.meta.env.VITE_BASE44_BASE_URL || 'https://api.base44.com'
});

// File upload integration
export const UploadFile = async ({ file }) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await base44.integrations.uploadFile(formData);
    return response;
  } catch (error) {
    console.error('File upload failed:', error);
    throw error;
  }
};