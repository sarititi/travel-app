const BASE_URL = 'http://localhost:3000';

/**
 * פונקציית הליבה הכללית - מבצעת קריאת fetch אחת לכל ה-API.
 * תומכת ב:
 *  - הוספת Authorization: Bearer <token> אוטומטית אם הועבר token
 *  - שליחת body כ-JSON, או כ-FormData אם isFormData = true
 *  - retries (ניסיונות חזרה) במקרה של כשל
 *  - חילוץ הודעת שגיאה מהשרת ({ error: '...' }) אם קיימת
 *
 * path - הנתיב היחסי כולל query string אם צריך, למשל:
 *        '/places/123/reviews' או '/places?page=1&limit=20'
 */
const request = async (path, { method = 'GET', body, token, isFormData = false, retries = 0 } = {}) => {
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (body !== undefined && !isFormData) headers['Content-Type'] = 'application/json';

  console.log(`[GeneralAPI] ${method} ${BASE_URL}${path}`);

  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : (isFormData ? body : JSON.stringify(body)),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (retries > 0) {
      console.warn(`[GeneralAPI] retrying ${method} ${path} (${retries} retries left)`);
      return request(path, { method, body, token, isFormData, retries: retries - 1 });
    }
    console.error(`[GeneralAPI] request failed: ${method} ${path}`, error);
    throw error;
  }
};

/**
 * GET - שליפת מידע. path יכול להכיל query string מלא.
 * ברירת מחדל: ניסיון חזרה אחד (retries=1), כי GET הוא אופרציה "בטוחה" לחזרה עליה.
 */
export const getData = (path, token, retries = 1) =>
  request(path, { method: 'GET', token, retries });

/**
 * POST - יצירת פריט חדש.
 * ברירת מחדל: בלי retries (retries=0), כדי לא ליצור כפילויות אם הקריאה כבר הצליחה בצד השרת
 * אבל התגובה לא הגיעה. אפשר להעביר retries גבוה יותר אם רוצים אחרת.
 */
export const create = (path, newItem, token, retries = 0) =>
  request(path, { method: 'POST', body: newItem, token, retries });

/** PUT - עדכון מלא של פריט */
export const update = (path, changes, token, retries = 0) =>
  request(path, { method: 'PUT', body: changes, token, retries });

/** PATCH - עדכון חלקי של פריט */
export const patchItem = (path, changes, token, retries = 0) =>
  request(path, { method: 'PATCH', body: changes, token, retries });

/** DELETE - מחיקת פריט */
export const deleteItem = (path, token, retries = 0) =>
  request(path, { method: 'DELETE', token, retries });

/** POST עם FormData (העלאת קבצים, תמונות וכו') */
export const uploadFile = (path, formData, token, retries = 0) =>
  request(path, { method: 'POST', body: formData, isFormData: true, token, retries });

/**
 * POST "גולמי" - מחזיר את ה-JSON שהשרת מחזיר גם אם res.ok === false
 * (לדוגמה: /auth/login שמחזיר { error: '...' } עם סטטוס שגיאה).
 * זורק חריגה רק אם הבקשה עצמה נכשלה (לדוגמה: אין חיבור לשרת) -
 * שימושי לפלואים עם fallback מקומי (offline).
 */
export const postRaw = async (path, body, retries = 0) => {
  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (response && response.json) return await response.json();
  } catch (error) {
    if (retries > 0) return postRaw(path, body, retries - 1);
    throw error;
  }
};