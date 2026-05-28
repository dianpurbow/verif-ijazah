"use client";
import { useState, useRef } from 'react';
import jsQR from 'jsqr';
import { generateHash } from '../../utils/hash';
import { verifyDegreeFromBlockchain } from '../../utils/blockchain';
import { Upload, CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function VerifyDegree() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [scannedData, setScannedData] = useState(null);
  
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setError('');
    setResult(null);
    setScannedData(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0, img.width, img.height);
        
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code) {
          try {
            const data = JSON.parse(code.data);
            setScannedData(data);
            verifyData(data);
          } catch (err) {
            setError("QR Code tidak mengandung data ijazah yang valid.");
            setLoading(false);
          }
        } else {
          setError("QR Code tidak ditemukan pada gambar. Coba gambar lain yang lebih jelas.");
          setLoading(false);
        }
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const verifyData = async (data) => {
    try {
      // 1. Re-hash the data extracted from QR
      const hash = generateHash(data);

      // 2. Query Smart Contract (No Metamask needed for read-only)
      const { isValid, timestamp } = await verifyDegreeFromBlockchain(hash);

      if (isValid) {
        setResult({
          status: 'valid',
          timestamp: new Date(timestamp * 1000).toLocaleString('id-ID'),
        });
      } else {
        setResult({
          status: 'invalid',
        });
      }

    } catch (err) {
      console.error(err);
      setError("Gagal terhubung ke jaringan Blockchain. Pastikan node lokal berjalan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '800px' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1>Verifikasi Publik</h1>
        <p>Unggah foto QR Code dari ijazah untuk memverifikasi keasliannya secara instan.</p>
      </div>

      <div className="glass-card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
        {!loading && !result && !scannedData && (
          <div>
            <Upload size={64} color="var(--primary-color)" style={{ margin: '0 auto 1.5rem', opacity: 0.8 }} />
            <h3 style={{ marginBottom: '1.5rem' }}>Pindai QR Code Ijazah</h3>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileUpload} 
              ref={fileInputRef}
              style={{ display: 'none' }}
            />
            <button 
              className="btn btn-primary" 
              onClick={() => fileInputRef.current.click()}
            >
              Pilih Gambar QR Code
            </button>
            <p style={{ marginTop: '1rem', fontSize: '0.85rem' }}>Mendukung format JPG, PNG.</p>
          </div>
        )}

        {loading && (
          <div style={{ padding: '2rem 0' }}>
            <Loader2 size={48} className="animate-spin" color="var(--primary-color)" style={{ margin: '0 auto 1rem' }} />
            <h3>Memverifikasi ke Blockchain...</h3>
            <p>Mengekstrak data dan mencocokkan hash kriptografi.</p>
          </div>
        )}

        {error && (
          <div style={{ textAlign: 'left' }}>
            <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
              {error}
            </div>
            <button className="btn" style={{ background: 'var(--border-color)', color: 'white' }} onClick={() => setError('')}>
              Coba Lagi
            </button>
          </div>
        )}

        {result && scannedData && (
          <div style={{ textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
              {result.status === 'valid' ? (
                <>
                  <CheckCircle size={48} color="var(--success-color)" />
                  <div>
                    <h2 style={{ margin: 0, color: 'var(--success-color)' }}>Ijazah Valid & Asli</h2>
                    <p style={{ margin: 0, fontSize: '0.9rem' }}>Tercatat di Blockchain pada: {result.timestamp}</p>
                  </div>
                </>
              ) : (
                <>
                  <XCircle size={48} color="var(--error-color)" />
                  <div>
                    <h2 style={{ margin: 0, color: 'var(--error-color)' }}>Ijazah Tidak Valid / Palsu</h2>
                    <p style={{ margin: 0, fontSize: '0.9rem' }}>Hash data ini tidak ditemukan di jaringan blockchain kami.</p>
                  </div>
                </>
              )}
            </div>

            <h3 style={{ marginBottom: '1rem' }}>Informasi Akademik:</h3>
            <div className="grid grid-2" style={{ gap: '1rem' }}>
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Nama Lengkap</span>
                <div style={{ fontWeight: 600 }}>{scannedData.name}</div>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Nomor Induk Mahasiswa</span>
                <div style={{ fontWeight: 600 }}>{scannedData.studentId}</div>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Program Studi</span>
                <div style={{ fontWeight: 600 }}>{scannedData.major}</div>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Tanggal Lulus</span>
                <div style={{ fontWeight: 600 }}>{scannedData.graduationDate}</div>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', gridColumn: '1 / -1' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Nomor Ijazah</span>
                <div style={{ fontWeight: 600 }}>{scannedData.degreeNumber}</div>
              </div>
            </div>

            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
              <button className="btn" style={{ background: 'var(--border-color)', color: 'white' }} onClick={() => { setResult(null); setScannedData(null); }}>
                Verifikasi Ijazah Lain
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
