"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BookOpen,
  Users,
  Vote,
  Coins,
  Star,
  Home,
  User,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAuthContext } from "@/components/auth/auth-provider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const sidebarItems = [
  {
    title: "Home",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Profile",
    href: "/profile",
    icon: User,
  },
  {
    title: "Feed",
    href: "/feed",
    icon: Star,
  },
  {
    title: "Torah Study",
    href: "/torah-study",
    icon: BookOpen,
  },
  {
    title: "Community",
    href: "/community",
    icon: Users,
  },
  {
    title: "Governance",
    href: "/governance",
    icon: Vote,
  },
  {
    title: "Economy",
    href: "/economy",
    icon: Coins,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuthContext();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Only show sidebar for authenticated users and hide on public routes
  const isPublicRoute = pathname === "/" || pathname === "/about" || pathname === "/auth";
  if (!user || isPublicRoute) return null;

  return (
    <div className="relative flex">
      <div
        className={cn(
          "flex flex-col border-r bg-background transition-all duration-300 ease-in-out",
          isCollapsed ? "w-[60px]" : "w-[240px]"
        )}
      >
        <ScrollArea className="flex-1 py-6">
          <div className="space-y-2 px-3">
            {sidebarItems.map((item) => {
              const IconComponent = item.icon;
              return isCollapsed ? (
                <TooltipProvider key={item.href}>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <Button
                        variant={pathname === item.href ? "secondary" : "ghost"}
                        className={cn(
                          "w-full justify-center",
                          pathname === item.href && "bg-secondary"
                        )}
                        asChild
                      >
                        <Link href={item.href}>
                          <IconComponent className="h-4 w-4" />
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="border bg-background">
                      {item.title}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <Button
                  key={item.href}
                  variant={pathname === item.href ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-2",
                    pathname === item.href && "bg-secondary"
                  )}
                  asChild
                >
                  <Link href={item.href}>
                    <IconComponent className="h-4 w-4" />
                    {item.title}
                  </Link>
                </Button>
              );
            })}
          </div>
        </ScrollArea>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-4 top-6 z-10 h-8 w-8 rounded-full border bg-background"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}