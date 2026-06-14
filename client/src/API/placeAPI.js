import { getData, create, update, deleteItem } from './generalAPI';

/**
 * שליפת רשימת מקומות עם סינון
 */
export const getPlaces = async ({ page = 1, limit = 20, search = '', category = '', open_on = '' } = {}) => {
  const query = new URLSearchParams();
  if (page)     query.set('page',    page);
  if (limit)    query.set('limit',   limit);
  if (search)   query.set('search',  search);
  if (category) query.set('category', category);
  if (open_on)  query.set('open_on', open_on);

  const data = await getData(`/places?${query.toString()}`);

  // המרה אוטומטית של created_by_id ל-created_by לכל המקומות ברשימה
  if (data && data.places) {
    data.places = data.places.map(place => ({
      ...place,
      created_by: place.created_by_id || place.created_by
    }));
  }

  return data;
};

/**
 * שליפת place בודד לפי ID
 */
export const getPlaceById = async (id) => {
  const data = await getData(`/places/${encodeURIComponent(id)}`);

  // המרה אוטומטית של created_by_id ל-created_by למקום בודד
  if (data) {
    data.created_by = data.created_by_id || data.created_by;
  }

  return data;
};

/**
 * הוספת place חדש (מחייב token)
 */
export const createPlace = (placeData, token) =>
  create('/places', placeData, token);

/**
 * עדכון place (מחייב token)
 */
export const updatePlace = (id, placeData, token) =>
  update(`/places/${encodeURIComponent(id)}`, placeData, token);

/**
 * מחיקת place (מחייב token)
 */
export const deletePlace = (id, token) =>
  deleteItem(`/places/${encodeURIComponent(id)}`, token);