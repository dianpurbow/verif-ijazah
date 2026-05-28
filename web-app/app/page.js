import Link from 'next/link';
import { ShieldCheck, GraduationCap, Search } from 'lucide-react';

export default function Home() {
  return (
    <div className="container" style={{ textAlign: 'center', marginTop: '4rem' }}>
      <ShieldCheck size={80} color="#3b82f6" style={{ margin: '0 auto', marginBottom: '2rem' }} />
      <h1>Keamanan Ijazah Masa Depan</h1>
      <p style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '1.5rem auto 3rem' }}>
        Sistem terdesentralisasi untuk menerbitkan dan memverifikasi ijazah akademik menggunakan teknologi blockchain. Anti-pemalsuan dan mudah diverifikasi.
      </p>
      
      <div className="grid grid-2" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className="glass-card">
          <GraduationCap size={48} color="#a855f7" style={{ marginBottom: '1rem' }} />
          <h3>Portal Universitas</h3>
          <p style={{ marginBottom: '1.5rem' }}>Terbitkan ijazah digital secara aman ke dalam jaringan blockchain dan hasilkan QR Code untuk fisik dokumen.</p>
          <Link href="/admin" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #a855f7, #7e22ce)' }}>
            Masuk Dashboard
          </Link>
        </div>
        
        <div className="glass-card">
          <Search size={48} color="#3b82f6" style={{ marginBottom: '1rem' }} />
          <h3>Verifikasi Publik</h3>
          <p style={{ marginBottom: '1.5rem' }}>HRD atau Perusahaan dapat memindai QR Code untuk memvalidasi keaslian ijazah secara instan tanpa login.</p>
          <Link href="/verify" className="btn btn-primary">
            Mulai Verifikasi
          </Link>
        </div>
      </div>
    </div>
  );
}
