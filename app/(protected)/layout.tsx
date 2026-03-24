"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";
import { LayoutDashboard, Users, LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOnlineSync } from "@/features/users/hooks/use-online-sync";


const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/users", label: "Utilisateurs", icon: Users },
];

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  useOnlineSync();
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      router.replace("/login");
    }
  }, [router]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    Cookies.remove("token");
    router.replace("/login");
  };

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Mobile header */}
      <header className="flex items-center justify-between border-b bg-card px-4 py-3 md:hidden">
        <h1 className="text-lg font-bold text-primary">Dashboard</h1>
        <Button variant="ghost" size="icon" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </Button>
      </header>

      {/* Mobile nav overlay */}
      {menuOpen && (
        <div className="border-b bg-card px-4 py-3 flex flex-col gap-1 md:hidden animate-in slide-in-from-top-2 duration-200">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={pathname.startsWith(item.href) ? "secondary" : "ghost"}
                className="w-full justify-start gap-2"
              >
                <item.icon className="size-4" />
                {item.label}
              </Button>
            </Link>
          ))}
          <Button variant="outline" className="w-full mt-2 gap-2" onClick={handleLogout}>
            <LogOut className="size-4" />
            Déconnexion
          </Button>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col gap-2 border-r bg-card p-4">
        <h1 className="text-lg font-bold text-primary mb-4">Dashboard</h1>
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={pathname.startsWith(item.href) ? "secondary" : "ghost"}
                className="w-full justify-start gap-2"
              >
                <item.icon className="size-4" />
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>
        <div className="mt-auto">
          <Button variant="outline" className="w-full gap-2" onClick={handleLogout}>
            <LogOut className="size-4" />
            Déconnexion
          </Button>
        </div>
      </aside>

      <main className="flex-1 p-3 sm:p-4 md:p-6 overflow-auto">{children}</main>
    </div>
  );
}
