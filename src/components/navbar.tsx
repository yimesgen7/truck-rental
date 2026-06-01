"use client";

import Link from "next/link";
import { Menu, Truck, X } from "lucide-react";
import { useState } from "react";

import { RequireAuthButton } from "@/components/require-auth-button";
import { useAuth } from "@/components/providers/auth-provider";
import { navLinks } from "@/lib/nav-links";
import { isAdmin } from "@/lib/roles";
import { cn } from "@/lib/utils";

const navLinkClass =
  "block rounded-lg px-3 py-2 text-zinc-300 transition hover:bg-zinc-900 hover:text-white";

const navBtnClass =
  "inline-flex items-center justify-center rounded-xl border border-zinc-700 px-4 py-2 text-sm font-semibold transition hover:bg-zinc-900";

export function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const accountHref = user && isAdmin(user.role) ? "/dashboard" : "/orders";
  const accountLabel = user && isAdmin(user.role) ? "Dashboard" : "Track orders";

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="relative border-b border-zinc-800">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 sm:py-5">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 text-xl font-bold sm:text-2xl"
        >
          <Truck className="text-orange-500" />
          TruckRent
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 text-sm text-zinc-300 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-3 lg:flex">
          {user ? (
            <>
              <Link href={accountHref} className={navBtnClass}>
                {accountLabel}
              </Link>
              <button
                type="button"
                onClick={() => logout()}
                className={navBtnClass}
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className={navBtnClass}>
                Log in
              </Link>
              <Link href="/register" className={navBtnClass}>
                Register
              </Link>
            </>
          )}
          <RequireAuthButton className="rounded-xl bg-orange-500 px-5 py-2 text-sm font-semibold transition hover:bg-orange-600">
            Rent Now
          </RequireAuthButton>
        </div>

        {/* Mobile: Rent + menu toggle */}
        <div className="flex items-center gap-2 lg:hidden">
          <RequireAuthButton className="rounded-xl bg-orange-500 px-3 py-2 text-xs font-semibold transition hover:bg-orange-600 sm:px-4 sm:text-sm">
            Rent Now
          </RequireAuthButton>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="rounded-xl border border-zinc-700 p-2 text-zinc-300 transition hover:bg-zinc-900 hover:text-white"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "border-t border-zinc-800 bg-black lg:hidden",
          menuOpen ? "block" : "hidden"
        )}
      >
        <nav className="mx-auto max-w-7xl space-y-1 px-4 py-4 sm:px-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMenu}
              className={navLinkClass}
            >
              {link.label}
            </Link>
          ))}

          <div className="mt-4 space-y-2 border-t border-zinc-800 pt-4">
            {user ? (
              <>
                <Link
                  href={accountHref}
                  onClick={closeMenu}
                  className={navLinkClass}
                >
                  {accountLabel}
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    closeMenu();
                  }}
                  className={cn(navBtnClass, "mt-2 w-full")}
                >
                  Log out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={closeMenu}
                  className={cn(navBtnClass, "w-full")}
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  onClick={closeMenu}
                  className={cn(navBtnClass, "w-full")}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
