'use client';
import Link from "next/link";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

const Page = () => {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between py-4">
        
        <Link href="/">
          <img
            src="/subtalonlogo.png"
            alt="Subtalon Logo"
            className="w-40 h-auto object-contain transition-transform duration-300 hover:scale-105"
          />
        </Link>

        <nav className="flex gap-12">
          <NavLink href="/profile" label="Profile" />
          <NavLink href="/subscriptions" label="Subscriptions" />
          <NavLink href="/calendar" label="Calendar" />
          <NavLink href="/statistics" label="Statistics" />
          <NavLink href="/settings" label="Settings" />
          <NavLink href="/about" label="About" />
        </nav>

        <div className="pl-8">
          <Button
            variant="outline"
            className="text-xl transition-all duration-300 hover:bg-red-500 hover:text-white"
            onClick={() => signOut({ callbackUrl: '/login' })}
          >
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

const NavLink = ({ href, label }: { href: string; label: string }) => (
  <Link
    href={href}
    className="relative text-3xl font-medium text-gray-800 hover:text-red-600 transition-colors duration-300
               after:content-[''] after:absolute after:left-1/2 after:translate-x-[-50%] after:-bottom-1
               after:h-[3px] after:w-0 hover:after:w-1/3 after:bg-red-600 after:transition-all after:duration-300"
  >
    {label}
  </Link>
);

export default Page;
