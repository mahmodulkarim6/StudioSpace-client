import './globals.css';
import { Bricolage_Grotesque, DM_Sans } from 'next/font/google';
import { Toaster } from 'sonner';
import AuthProvider from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const display = Bricolage_Grotesque({ subsets: ['latin'], variable: '--font-display' });
const body = DM_Sans({ subsets: ['latin'], variable: '--font-body' });

export const metadata = { title: 'StudioSpace | Book creative studios by the hour', description: 'Peer-to-peer marketplace for photo studios, sound stages, podcast rooms and music suites.' };

const themeScript = `try{var t=localStorage.getItem('theme')||(matchMedia('(prefers-color-scheme: dark)').matches?'studiodark':'studiolight');document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme='studiolight'}`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="studiolight" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head>
      <body className={`${display.variable} ${body.variable} font-sans`}>
      <AuthProvider>
      <Navbar />
      <main className="min-h-[70vh]">{children}</main>
      <Footer />
      <Toaster richColors position="top-right" closeButton />
    </AuthProvider>
  </body>
  </html>
  );
}