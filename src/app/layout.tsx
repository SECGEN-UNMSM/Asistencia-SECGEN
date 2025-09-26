import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AttendanceProvider } from "@/contexts/attendance-context";
import { SettingsProvider } from "@/contexts/settings-context";
import { Toaster } from "@/components/ui/toaster";
import AppHeader from "@/components/app-header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Control de Asistencia",
  description: "Sistema de asistencia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <SettingsProvider>
        <AttendanceProvider>
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground flex flex-col min-h-screen`}
          >
            <AppHeader />
            <main className="flex-grow min-h-[calc(100vh-var(--header-height,4rem)-var(--footer-height,2.5rem))]">
              {children}
            </main>
            <Toaster />
            <footer
              className="w-full py-4 text-center text-sm text-white border-t border-border"
              style={{ height: "var(--footer-height, 2.5rem)" }}
            >
              <p>&copy; Unidad de Informática - SECGEN</p>
            </footer>
          </body>
        </AttendanceProvider>
      </SettingsProvider>
    </html>
  );
}
