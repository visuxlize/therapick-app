"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Compass,
  Heart,
  TrendingUp,
  Settings,
  Menu,
  LogOut,
} from "lucide-react";

type User = {
  id: string;
  email: string | null;
  name: string | null;
  avatarUrl: string | null;
};

function getInitials(name: string | null, email: string | null): string {
  if (name?.trim()) {
    return name
      .trim()
      .split(/\s+/)
      .map((p) => p[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }
  return (email ?? "").slice(0, 2).toUpperCase();
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => {
        if (r.status === 401) {
          router.replace("/login?redirect=" + encodeURIComponent(pathname));
          return null;
        }
        return r.json();
      })
      .then((data) => data?.user && setUser(data.user))
      .catch(() => router.replace("/login"));
  }, [pathname, router]);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  const nav = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/discover", label: "Discover", icon: Compass },
    { href: "/favorites", label: "Favorites", icon: Heart },
    { href: "/mood-tracker", label: "Mood Tracker", icon: TrendingUp },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#0A0E1A]">
      {/* Mobile menu button */}
      <button
        type="button"
        onClick={() => setSidebarOpen((o) => !o)}
        className="fixed left-4 top-4 z-50 rounded-lg border border-white/10 bg-white/5 p-2 text-white lg:hidden"
        aria-label="Toggle menu"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 h-full w-64 border-r border-white/10 bg-[#0A0E1A]/95 backdrop-blur transition-transform lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col p-4 pt-16 lg:pt-6">
          <Link
            href="/dashboard"
            className="mb-8 font-serif text-xl font-bold text-[#4CAF50]"
          >
            Therapick
          </Link>

          <nav className="flex-1 space-y-1">
            {nav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[#4CAF50]/20 text-[#4CAF50]"
                      : "text-white/80 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-white/10 pt-4">
            <div className="mb-3 flex items-center gap-3 rounded-lg px-3 py-2">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#4CAF50]/20 text-sm font-semibold text-[#4CAF50]">
                {user ? getInitials(user.name, user.email) : "—"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white">
                  {user?.name || "Loading…"}
                </p>
                <p className="truncate text-xs text-white/60">{user?.email}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/80 transition-colors hover:bg-white/5 hover:text-white"
            >
              <LogOut className="h-5 w-5" />
              Log out
            </button>
          </div>
        </div>
      </aside>

      <main className="lg:pl-64">
        <div className="min-h-screen p-6 pt-20 lg:pt-6">{children}</div>
      </main>
    </div>
  );
}
