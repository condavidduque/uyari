import type { ReactNode } from 'react';

export const metadata = { title: 'Uyari', description: 'Asistente de reuniones de ConPakta' };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body style={{ fontFamily: 'system-ui, sans-serif', margin: 0, padding: '2rem' }}>{children}</body>
    </html>
  );
}
