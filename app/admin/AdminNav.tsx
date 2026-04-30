"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/admin/dashboard", label: "儀表板" },
  { href: "/admin", label: "後台設定" },
  { href: "/admin/rsvp", label: "出席管理" },
  { href: "/admin/guestbook", label: "留言管理" },
];

export default function AdminNav() {
  const pathname = usePathname();
  if (pathname === "/admin/login") return null;

  return (
    <nav className="bg-white border-b border-stone-200 px-4 md:px-8 py-3 flex items-center gap-1 md:gap-2 sticky top-0 z-40 overflow-x-auto scrollbar-hide">
      <span className="font-serif text-stone-800 mr-3 text-sm md:text-base shrink-0">
        Wedding Admin
      </span>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`text-xs md:text-sm font-semibold px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
            pathname === item.href
              ? "bg-primary/10 text-primary"
              : "text-stone-500 hover:text-primary"
          }`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
