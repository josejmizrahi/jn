"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { Star, LogIn, UserPlus } from "lucide-react";
import { useAuthContext } from "@/components/auth/auth-provider";
import { useAuth } from "@/hooks/use-auth";

const publicRoutes = [
  { title: "Home", href: "/" },
  { title: "About", href: "/about" },
];

export function Nav() {
  const pathname = usePathname();
  const { user } = useAuthContext();
  const { signOut } = useAuth();

  // Show nav only on public routes when not authenticated
  const isPublicRoute = pathname === "/" || pathname === "/about" || pathname === "/auth";
  if (user && !isPublicRoute) return null;

  return (
    <header className="sticky top-0 z-50 w-full h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-full items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Star className="h-6 w-6" />
            <span className="font-bold">Jewish Network State</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {publicRoutes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={
                  pathname === route.href
                    ? "text-foreground"
                    : "text-foreground/60 transition-colors hover:text-foreground"
                }
              >
                {route.title}
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile Logo */}
        <Link href="/" className="md:hidden flex items-center space-x-2">
          <Star className="h-6 w-6" />
          <span className="font-bold">Jewish Network State</span>
        </Link>

        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <ModeToggle />
            {!user && (
              <>
                <Button asChild variant="ghost" size="sm" className="hidden sm:flex">
                  <Link href="/auth?tab=signin">
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In
                  </Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/auth?tab=signup">
                    <UserPlus className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Sign Up</span>
                  </Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}