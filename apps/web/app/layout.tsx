import type { ReactNode } from 'react';
import { CuentaMenu } from './CuentaMenu';

export const metadata = { title: 'Uyari', description: 'Asistente de reuniones de ConPakta' };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body style={{ fontFamily: 'system-ui, sans-serif', margin: 0 }}>
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 2rem', borderBottom: '1px solid #e5e7eb' }}>
          <strong>Uyari</strong>
          <CuentaMenu />
        </header>
        <div style={{ padding: '2rem' }}>{children}</div>
      </body>
    </html>
  );
}
