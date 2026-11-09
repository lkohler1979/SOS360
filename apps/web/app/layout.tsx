import type { ReactNode } from 'react';
import './globals.css';
import './sos360-ui.css';
export const metadata = { title: 'SOS360 | Prepare-se para proteger', description: 'Preparação familiar, kits de emergência e sobrevivência.', manifest: '/manifest.webmanifest' };
export default function RootLayout({ children }: { children: ReactNode }) { return <html lang="pt-BR"><body>{children}</body></html>; }
