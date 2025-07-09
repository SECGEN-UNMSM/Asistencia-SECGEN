
"use client";
import Link from 'next/link';
import { ClipboardCheck } from 'lucide-react';

export default function AppHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm" style={{ height: 'var(--header-height, 4rem)'}}>
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0 px-4 md:px-6">
        <Link href="/" className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors">
          <span className="text-2xl font-bold">Control de Asistencia</span>
        </Link>
      </div>
    </header>
  );
}
