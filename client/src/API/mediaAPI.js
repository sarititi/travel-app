import { getData, uploadFile, deleteItem } from './generalAPI';

/**
 * שליפת כל המדיה (תמונות/פוסטים) של מקום
 */
export const getMedia = (placeId) =>
  getData(`/places/${encodeURIComponent(placeId)}/media`);

/**
 * העלאת מדיה חדשה (תמונה) למקום — דורש טוקן
 * file: File object
 */
export const uploadMedia = (placeId, file, token) => {
  const formData = new FormData();
  formData.append('file', file);

  return uploadFile(`/places/${encodeURIComponent(placeId)}/media`, formData, token);
};

/**
 * מחיקת מדיה — רק הבעלים או אדמין
 */
export const deleteMedia = (placeId, mediaId, token) =>
  deleteItem(`/places/${encodeURIComponent(placeId)}/media/${encodeURIComponent(mediaId)}`, token);