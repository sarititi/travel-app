import { useState } from 'react';

export default function PlaceMediaGrid({ placeId, initialMedia }) {
  const [mediaList, setMediaList] = useState(initialMedia);
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    formData.append('place_id', placeId);
    for (let i = 0; i < files.length; i++) {
      formData.append('mediaFiles', files[i]);
    }

    try {
      setUploading(true);
      // שמירה על התאמה מדויקת לשרת הקיים שלכן
      const response = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('העלאת הקבצים נכשלה');
      const uploadedData = await response.json();
      
      // עדכון הלוקאל סטייט עם המדיה החדשה שהשרת החזיר
      setMediaList(prev => [...prev, ...uploadedData.newMedia]);
    } catch (err) {
      alert(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <section className="place-media-section">
      <h3>גלריית תמונות מהמקום</h3>
      
      <div className="media-upload-zone">
        <label htmlFor="media-file-input" className="btn-secondary">
          {uploading ? 'מעלה קבצים...' : 'הוסף תמונות/סרטונים'}
        </label>
        <input
          id="media-file-input"
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={handleFileUpload}
          disabled={uploading}
          style={{ display: 'none' }}
        />
      </div>

      {mediaList.length === 0 ? (
        <p className="no-media-text">אין עדיין תמונות עבור מקום זה. היו הראשונים לשתף!</p>
      ) : (
        <div className="media-gallery-grid">
          {mediaList.map((item) => (
            <div key={item.media_id} className="media-grid-item">
              {item.file_type?.startsWith('video') ? (
                <video src={item.file_url} controls preload="metadata" />
              ) : (
                <img src={item.file_url} alt="מדיה מהאתר" loading="lazy" />
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}