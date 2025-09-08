"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  const hideAuthButtons =
    pathname === "/auth/signin" || pathname === "/auth/signup";

  return (
    <header className="p-4 bg-black text-white">
      <div
        className={`max-w-6xl mx-auto flex flex-wrap items-center ${
          hideAuthButtons ? "justify-center" : "justify-between"
        } gap-3`}
      >
        {/* Logo */}
        <Link
          href="/dashboard"
          className="flex items-center cursor-default flex-shrink-0"
        >
        <img
      src="/logo.png"
      alt="Logo"
      className="h-6 w-6"
      style={{
        filter: "brightness(0) invert(1)", 
      }}
    />

        </Link>

        {/* Navigation */}
        {!hideAuthButtons && (
          <nav className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mt-2 sm:mt-0">
            {status === "loading" ? (
              <span className="text-sm text-gray-300">Loading...</span>
            ) : session ? (
              <>
                <span className="text-sm sm:text-base truncate max-w-[100px]">
                  Hi, {session.user?.name ?? "User"}
                </span>
                <button
                  onClick={() =>
                    signOut().then(() => {
                      window.location.href = "/";
                    })
                  }
                  className="text-sm font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] px-3 py-1.5 sm:px-4 sm:py-2 rounded-full"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="text-sm font-semibold text-black bg-gray-100 hover:bg-gray-200 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="text-sm font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] px-3 py-1.5 sm:px-4 sm:py-2 rounded-full"
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
