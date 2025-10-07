import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';
import ChatBot from '@/components/comon/Chatbot';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-16"> {children}</main>
      <Footer />
      <ChatBot />
    </>
  );
}
