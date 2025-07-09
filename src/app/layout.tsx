import type {Metadata} from 'next';
import {DM_Sans} from 'next/font/google';
import './globals.css';
import { AttendanceProvider } from '@/contexts/attendance-context';
import { Toaster } from "@/components/ui/toaster";
import AppHeader from '@/components/app-header';

const dmsans = DM_Sans({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Control de Asistencia',
  description: 'Control de Asistencia de los participantes en reuniones de la UNMSM.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${dmsans.className} ${dmsans.className} antialiased bg-background text-foreground flex flex-col min-h-screen`}
      >
        <AttendanceProvider>
          <AppHeader />
          <main className="flex-grow min-h-[calc(100vh-var(--header-height,4rem)-var(--footer-height,2.5rem))] bg-[#7c0821]">
            {children}
          </main>
          <Toaster />
          <footer
            className="w-full py-4 text-center text-sm text-white border-t border-border bg-[#7c0821]"
            style={{ height: "var(--footer-height, 2.5rem)" }}
          >
            <p>&copy; Unidad de Informática - SECGEN</p>
          </footer>
        </AttendanceProvider>
      </body>
    </html>
  );
}
