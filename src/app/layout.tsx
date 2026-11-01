import type { Metadata } from 'next';
import './globals.css';
import { RoleProvider } from '@/lib/auth/role-context';
import { Navbar } from '@/components/navbar';
import { SiteFooter } from '@/components/footer';
import { LiveTicker } from '@/components/live-ticker';
import { SimDebugModal } from '@/components/sim-debug-modal';
import { CAMPUS_CONFIG } from '@/lib/config/campus';

export const metadata: Metadata = {
  title: 'Eco Class — Sustainable Class',
  description: `AI-Powered Smart Campus Energy Conservation Platform for ${CAMPUS_CONFIG.collegeName}`,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <RoleProvider>
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <main style={{ flex: 1, padding: '0 20px', maxWidth: '1360px', width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
              {children}
            </main>
            <SiteFooter />
            <LiveTicker />
            <SimDebugModal />
          </div>
        </RoleProvider>
      </body>
    </html>
  );
}
