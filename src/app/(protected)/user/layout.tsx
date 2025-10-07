import PublicLayout from "@/app/(public)/layout";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PublicLayout>
        <main className="min-h-screen pt-16"> {children}</main>
      </PublicLayout>
    </>
  );
}