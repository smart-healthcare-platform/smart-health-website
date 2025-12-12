'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';
import ChatBot from '@/components/common/chat-bot';

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isChatHistory = pathname?.includes('/chat-history');

  return (
    <>
      <Header />
      <main className={isChatHistory ? "h-screen pt-16 overflow-hidden" : "min-h-screen pt-16"}>
        {children}
      </main>
      {!isChatHistory && <Footer />}
      <ChatBot />
    </>
  );
}