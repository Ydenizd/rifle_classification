// Backend URL – localhost veya sunucunun IP/domain adresi
const BACKEND_URL = "http://localhost:5000";

// Görsel sınıflandırma fonksiyonu
export const classifyImage = async (imageFile) => {
  try {
    console.log('🚀 Sınıflandırma başlatılıyor...');
    console.log('📁 Yüklenen dosya:', imageFile.name, `(${(imageFile.size/1024).toFixed(1)} KB)`);

    const formData = new FormData();
    formData.append('image', imageFile); // Backend "image" olarak bekliyor

    const response = await fetch(`${BACKEND_URL}/classify`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`❌ HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    console.log('✅ Tahmin sonucu:', result);
    return result;

  } catch (error) {
    console.error('💥 Sınıflandırma hatası:', error);
    throw error;
  }
};

// Backend'e bağlılık testi (opsiyonel)
export const testConnection = async () => {
  try {
    const res = await fetch(`${BACKEND_URL}/health`);
    if (res.ok) {
      const data = await res.json();
      console.log("✅ Backend bağlı:", data);
      return true;
    } else {
      console.warn("⚠️ Backend erişilebilir değil.");
      return false;
    }
  } catch (err) {
    console.error("❌ Backend bağlantı hatası:", err);
    return false;
  }
};
