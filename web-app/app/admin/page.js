"use client";
import { useState } from 'react';
import QRCode from 'qrcode';
import { generateHash } from '../../utils/hash';
import { addDegreeToBlockchain } from '../../utils/blockchain';
import { Download, Loader2, ShieldCheck } from 'lucide-react';

export default function AdminDashboard() {
  const [formData, setFormData] = useState({
    name: '',
    studentId: '',
    major: '',
    graduationDate: '',
    degreeNumber: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [qrCodeData, setQrCodeData] = useState('');
  const [txHash, setTxHash] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setQrCodeData('');
    setTxHash('');

    try {
      // 1. Generate SHA-256 hash of the data
      const dataHash = generateHash(formData);

      // 2. Add hash to local Hardhat blockchain
      const transactionHash = await addDegreeToBlockchain(dataHash);
      setTxHash(transactionHash);

      // 3. Generate QR Code containing the JSON data
      // For real world, this could point to a URL like: https://domain.com/verify?data=...
      const qrData = JSON.stringify(formData);
      const qrCodeUrl = await QRCode.toDataURL(qrData, { width: 300, margin: 2, color: { dark: '#0f172a', light: '#ffffff' } });
      setQrCodeData(qrCodeUrl);

    } catch (err) {
      console.error(err);
      setError(err.message || "Terjadi kesalahan saat memproses data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div style={{ marginBottom: '2rem' }}>
        <h1>Dashboard Universitas</h1>
        <p>Penerbitan ijazah digital dan pencatatan ke dalam jaringan blockchain.</p>
      </div>

      <div className="grid grid-2">
        <div className="glass-card">
          <h3>Input Data Lulusan</h3>
          
          {error && <div className="alert alert-error">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nama Lengkap</label>
              <input type="text" name="name" className="form-input" required value={formData.name} onChange={handleInputChange} />
            </div>
            
            <div className="form-group">
              <label>Nomor Induk Mahasiswa (NIM)</label>
              <input type="text" name="studentId" className="form-input" required value={formData.studentId} onChange={handleInputChange} />
            </div>
            
            <div className="form-group">
              <label>Program Studi</label>
              <input type="text" name="major" className="form-input" required value={formData.major} onChange={handleInputChange} />
            </div>

            <div className="form-group">
              <label>Tanggal Lulus (YYYY-MM-DD)</label>
              <input type="date" name="graduationDate" className="form-input" required value={formData.graduationDate} onChange={handleInputChange} />
            </div>

            <div className="form-group">
              <label>Nomor Ijazah / SKL</label>
              <input type="text" name="degreeNumber" className="form-input" required value={formData.degreeNumber} onChange={handleInputChange} />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
              {loading ? <><Loader2 className="animate-spin" /> Memproses...</> : 'Terbitkan Ijazah & Simpan ke Blockchain'}
            </button>
          </form>
        </div>

        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          {qrCodeData ? (
            <>
              <div className="alert alert-success" style={{ width: '100%', marginBottom: '1rem' }}>
                Ijazah berhasil diterbitkan! Hash tersimpan di blockchain.
                <br/>
                <small style={{ wordBreak: 'break-all', opacity: 0.8 }}>Tx: {txHash}</small>
              </div>
              
              <h3 style={{ marginBottom: '1rem' }}>QR Code Ijazah</h3>
              <img src={qrCodeData} alt="QR Code" style={{ borderRadius: '8px', marginBottom: '1.5rem', border: '4px solid white' }} />
              
              <a href={qrCodeData} download={`qrcode_${formData.studentId}.png`} className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                <Download size={20} /> Unduh QR Code
              </a>
              <p style={{ marginTop: '1rem', fontSize: '0.9rem' }}>Sematkan QR Code ini pada ijazah fisik atau file PDF.</p>
            </>
          ) : (
            <div style={{ color: 'var(--text-secondary)' }}>
              <ShieldCheck size={64} style={{ opacity: 0.2, margin: '0 auto 1rem' }} />
              <p>Isi form di samping untuk mulai menerbitkan ijazah baru.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
