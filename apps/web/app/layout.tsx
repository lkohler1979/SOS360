import type { ReactNode } from 'react';
export const metadata = { title: 'SOS360', description: 'Prepare-se hoje. Sobreviva amanhã.', manifest: '/manifest.webmanifest' };
export default function RootLayout({ children }: { children: ReactNode }) { return <html lang="pt-BR"><body style={{fontFamily:'system-ui',margin:0,background:'#f5f7f8',color:'#17242a'}}>{children}</body></html>; }
