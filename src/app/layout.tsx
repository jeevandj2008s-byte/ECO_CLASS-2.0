import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Eco Class - Sustainable Class',
  description: 'Smart-Classroom Energy Conservation Platform for Colleges',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui, -apple-system, sans-serif', margin: 0, padding: 0, background: '#f8fafc', color: '#0f172a' }}>
        <header style={{ background: '#0f172a', color: '#fff', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #22c55e' }}>
          <div>
            <Link href="/" style={{ color: '#fff', textDecoration: 'none', fontSize: '20px', fontWeight: 'bold' }}>
              Eco Class <span style={{ color: '#22c55e', fontSize: '14px', fontWeight: 'normal' }}>| Sustainable Class</span>
            </Link>
          </div>
          <nav style={{ display: 'flex', gap: '16px', fontSize: '14px' }}>
            <Link href="/map" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Campus Map</Link>
            <Link href="/classroom/c1000000-0000-0000-0000-000000000204" style={{ color: '#cbd5e1', textDecoration: 'none' }}>3D Classroom</Link>
            <Link href="/energy" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Energy</Link>
            <Link href="/incidents" style={{ color: '#f87171', textDecoration: 'none', fontWeight: 'bold' }}>Emergency Help Desk</Link>
            <Link href="/vision" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Vision Lab</Link>
            <Link href="/simulator" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Simulator</Link>
            <Link href="/assistant" style={{ color: '#67e8f9', textDecoration: 'none' }}>AI Assistant</Link>
            <Link href="/admin" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Admin</Link>
            <Link href="/login" style={{ background: '#22c55e', color: '#0f172a', padding: '4px 12px', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold' }}>Sign In</Link>
          </nav>
        </header>
        <main style={{ padding: '24px', maxWidth: '1280px', margin: '0 auto' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
