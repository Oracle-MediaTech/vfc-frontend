"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import {
  Church,
  LogOut,
  Menu,
  X,
  BarChart3,
  Building2,
  UserCheck,
  UserCog,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { authService } from "@/services/authService";
import { useCurrentUser } from "@/hooks/use-current-user";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const WORKER_ITEMS = [
  { title: "Dashboard",      href: "/dashboard",             icon: BarChart3 },
  { title: "My Departments", href: "/dashboard/departments", icon: Building2 },
  { title: "Attendance",     href: "/dashboard/attendance",  icon: UserCheck },
  { title: "Profile",        href: "/dashboard/profile",     icon: UserCog },
];

const WorkerSidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const { isAdmin } = useCurrentUser();

  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  const handleLogout = async () => {
    await authService.logout();
    router.push("/login");
  };


  useEffect(() => {
    setMounted(true);
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isOpen && isMobile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, isMobile]);

  if (!mounted) return null;

  return (
    <>
      {/*  Backdrop overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-black/40 backdrop-blur-[2px] z-45 md:hidden transition-opacity duration-300",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsOpen(false)}
      />

      <div className="fixed top-4 right-4 z-40 md:hidden">
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 bg-white hover:bg-gray-50 shadow-md border border-gray-200 rounded-lg active:scale-95 transition-transform"
          onClick={() => setIsOpen(true)}
        >
          <Menu className="h-5 w-5 text-gray-700" />
        </Button>
      </div>

      <aside
        className={cn(
          "fixed top-0 left-0 h-screen bg-white border-r z-50 flex flex-col justify-between p-3",
          "transition-all duration-300 ease-out will-change-transform",
          "w-[280px] md:w-auto shadow-2xl md:shadow-none",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          isOpen ? "md:w-64" : "md:w-16"
        )}
      >
        <div className="flex flex-col h-full justify-between">
          <div>

            <div
              className={cn(
                "flex items-center mb-8 h-10",
                isOpen ? "justify-between" : "md:justify-center"
              )}
            >
              {(isOpen || isMobile) && (
                <Link href="/dashboard" className="flex items-center gap-2">
                  <Church className="h-6 w-6 text-gray-900" />
                  <span className="font-semibold text-gray-900 tracking-tight">Worker Panel</span>
                </Link>
              )}
              
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 active:scale-95 transition-transform"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>

            {/* links for navigation */}
            <nav className="space-y-1">
              {WORKER_ITEMS.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-150 active:scale-[0.98]",
                      active
                        ? "bg-gray-100 text-gray-900 font-semibold"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900",
                      !isOpen && "md:justify-center"
                    )}
                  >
                    <item.icon className={cn("h-5 w-5 shrink-0", active ? "text-gray-900" : "opacity-80")} />
                    {(isOpen || isMobile) && (
                      <span className="text-[14px] truncate">{item.title}</span>
                    )}
                  </Link>
                );
              })}

             
              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-150 active:scale-[0.98] mt-4 border-t pt-4",
                    "text-gray-500 hover:bg-gray-50 hover:text-gray-900",
                    !isOpen && "md:justify-center"
                  )}
                >
                  <Shield className="h-5 w-5 shrink-0 text-gray-700" />
                  {(isOpen || isMobile) && (
                    <span className="text-[14px] font-medium truncate">Admin Panel</span>
                  )}
                </Link>
              )}
            </nav>
          </div>

          <div className="px-1">
            <Button
              variant="ghost"
              className={cn(
                "w-full text-red-500 hover:text-red-700 hover:bg-red-50 py-3 rounded-xl active:scale-[0.98] transition-all",
                !isOpen && "md:justify-center"
              )}
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5 shrink-0" />
              {(isOpen || isMobile) && (
                <span className="ml-2 text-[14px] font-medium">Logout</span>
              )}
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default WorkerSidebar;