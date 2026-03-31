"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";
import { LayoutDashboard, Users, LogOut, Menu, X, Bell, UserPlus, UserPen, UserX, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOnlineSync } from "@/features/users/hooks/use-online-sync";
import SocketProvider from "@/providers/socket-provider";
import NotificationsProvider, { useNotificationsContext } from "@/providers/notifications-provider";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/users", label: "Utilisateurs", icon: Users },
];

const notificationIcon = {
  created: UserPlus,
  updated: UserPen,
  deleted: UserX,
};

function NotificationBell() {
  const { notifications, unreadCount, markAllRead, clear } = useNotificationsContext();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) markAllRead();
  }, [open, markAllRead]);

  const toggle = () => setOpen((prev) => !prev);

  return (
    <div className="relative">
      <Button variant="ghost" size="icon" onClick={toggle} className="relative">
        <Bell className="size-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Button>

      {open && (
        <div className="absolute right-0 top-full mt-2 z-50 w-80 rounded-lg border bg-card shadow-lg">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <h3 className="text-sm font-semibold">Notifications</h3>
            {notifications.length > 0 && (
              <Button variant="ghost" size="sm" className="h-auto p-1 text-xs text-muted-foreground" onClick={clear}>
                <Trash2 className="size-3 mr-1" />
                Vider
              </Button>
            )}
          </div>
          <div className="max-h-72 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-muted-foreground">Aucune notification</p>
            ) : (
              notifications.map((n) => {
                const Icon = notificationIcon[n.type];
                return (
                  <div key={n.id} className="flex items-start gap-3 border-b px-4 py-3 last:border-0">
                    <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">{n.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {n.timestamp.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function LayoutContent({ children }: { children: React.ReactNode }) {
  useOnlineSync();
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { unreadCount } = useNotificationsContext();

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
        <div className="flex items-center gap-1">
          <NotificationBell />
          <Button variant="ghost" size="icon" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
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

        {/* Notifications in sidebar */}
        <div className="mt-4 border-t pt-4">
          <div className="flex items-center gap-2 px-2 mb-2">
            <Bell className="size-4 text-muted-foreground" />
            <span className="text-sm font-medium">Notifications</span>
            {unreadCount > 0 && (
              <span className="ml-auto flex size-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </div>
          <NotificationsList />
        </div>

        <div className="mt-auto">
          <Button variant="outline" className="w-full gap-2" onClick={handleLogout}>
            <LogOut className="size-4" />
            Déconnexion
          </Button>
        </div>
      </aside>

      {/* Desktop top bar with notification icon */}
      <div className="flex-1 flex flex-col overflow-auto">
        <header className="hidden md:flex items-center justify-end border-b bg-card px-6 py-3">
          <NotificationBell />
        </header>
        <main className="flex-1 p-3 sm:p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}

function NotificationsList() {
  const { notifications } = useNotificationsContext();
  const recent = notifications.slice(0, 5);

  if (recent.length === 0) {
    return <p className="px-2 text-xs text-muted-foreground">Aucune notification</p>;
  }

  return (
    <div className="flex flex-col gap-1">
      {recent.map((n) => {
        const Icon = notificationIcon[n.type];
        return (
          <div key={n.id} className="flex items-start gap-2 rounded-md px-2 py-1.5 text-xs">
            <Icon className="mt-0.5 size-3 shrink-0 text-muted-foreground" />
            <span className={n.read ? "text-muted-foreground" : ""}>{n.message}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <SocketProvider>
      <NotificationsProvider>
        <LayoutContent>{children}</LayoutContent>
      </NotificationsProvider>
    </SocketProvider>
  );
}
