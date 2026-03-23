"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/users", label: "Utilisateurs" },
];

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
    }
  }, [router]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.replace("/login");
  };

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Mobile header */}
      <header className="flex items-center justify-between border-b bg-card p-3 md:hidden">
        <h1 className="text-lg font-bold text-primary">Dashboard</h1>
        <Button variant="ghost" size="sm" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          )}
        </Button>
      </header>

      {/* Mobile nav overlay */}
      {menuOpen && (
        <div className="border-b bg-card p-3 flex flex-col gap-1 md:hidden">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={pathname === item.href ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                {item.label}
              </Button>
            </Link>
          ))}
          <Button variant="outline" className="w-full mt-2" onClick={handleLogout}>
            Déconnexion
          </Button>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 flex-col gap-2 border-r bg-card p-4">
        <h1 className="text-lg font-bold text-primary mb-4">Dashboard</h1>
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={pathname === item.href ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>
        <div className="mt-auto">
          <Button variant="outline" className="w-full" onClick={handleLogout}>
            Déconnexion
          </Button>
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-6">{children}</main>
    </div>
  );
}
