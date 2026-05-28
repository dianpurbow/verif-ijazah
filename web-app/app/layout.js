import './globals.css';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'Sistem Verifikasi Ijazah Blockchain',
  description: 'Platform verifikasi keaslian ijazah universitas menggunakan teknologi blockchain',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <header className="header">
          <Link href="/" className="header-logo">
            <ShieldCheck size={28} color="#3b82f6" />
            <span>BlockDegree</span>
          </Link>
          <nav className="nav-links">
            <Link href="/" className="nav-link">Home</Link>
            <Link href="/admin" className="nav-link">Admin Universitas</Link>
            <Link href="/verify" className="nav-link">Verifikasi Publik</Link>
          </nav>
        </header>
        <main style={{ flex: 1 }}>
          {children}
        </main>
      </body>
    </html>
  );
}
