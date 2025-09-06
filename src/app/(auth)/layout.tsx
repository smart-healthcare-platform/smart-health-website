export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen w-full bg-gray-50 flex flex-col">
      {children}
    </main>
  );
}
