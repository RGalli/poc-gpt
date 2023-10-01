import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'POC GPT',
  description: 'POC para testar a API da OpenAI',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='pt-BR'>
      <body>{children}</body>
    </html>
  );
}
