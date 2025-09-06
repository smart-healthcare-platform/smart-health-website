import PublicLayout from "@/app/(public)/layout";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <PublicLayout>
      {children}
    </PublicLayout>
  );
}