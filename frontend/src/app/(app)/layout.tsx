"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { useAuth } from "@/lib/auth-context";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return <div className="flex min-h-screen items-center justify-center text-muted">Carregando...</div>;
  }

  return (
    <div className="flex min-h-screen bg-cream">
      <Sidebar />
      <main className="flex-1 min-w-0 p-8">{children}</main>
    </div>
  );
}
