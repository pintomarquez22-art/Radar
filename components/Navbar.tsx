"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Radio, TrendingUp, Plus, LayoutDashboard, Train } from "lucide-react";

const links = [
  { href: "/",                label: "Feed",           Icon: LayoutDashboard },
  { href: "/trends",          label: "Tendencias",     Icon: TrendingUp },
  { href: "/infraestructura", label: "Infraestructura", Icon: Train },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-gray-900 dark:text-white">
          <span className="relative">
            <Radio size={22} className="text-radar-500" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-radar-500 animate-pulse-slow" />
          </span>
          <span>Radar</span>
          <span className="text-xs font-normal text-gray-400 hidden sm:block">· señales & tendencias</span>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-1">
          {links.map(({ href, label, Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === href
                  ? "bg-radar-50 dark:bg-radar-900/30 text-radar-600 dark:text-radar-400"
                  : "text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <Icon size={15} />
              <span className="hidden sm:block">{label}</span>
            </Link>
          ))}

          <Link
            href="/signals/new"
            className="flex items-center gap-1.5 ml-2 px-3 py-1.5 rounded-lg text-sm font-semibold bg-radar-500 hover:bg-radar-600 text-white transition-colors shadow-sm"
          >
            <Plus size={15} />
            <span className="hidden sm:block">Nueva señal</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
