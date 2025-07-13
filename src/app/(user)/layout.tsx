import Header from '@/components/layouts/Header'
import Footer from '@/components/layouts/Footer'

export default function UserPublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white pt-18"> {/* tránh bị header che */}
        {children}
      </main>
      <Footer />
    </>
  )
}
