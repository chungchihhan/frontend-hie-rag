"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Search,
  FileText,
  CloudUpload,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  isCollapsed: boolean;
}

const NavItem = ({
  href,
  icon,
  label,
  isActive,
  isCollapsed,
}: NavItemProps) => {
  return (
    <Link
      href={href}
      className={`
        flex ${
          isCollapsed ? "justify-center" : "justify-start"
        } items-center gap-3 p-4 rounded-lg transition-all duration-200
        ${
          isActive
            ? "bg-neutral-600 text-white"
            : "text-neutral-300 hover:bg-neutral-700/50"
        }
      `}
    >
      <div className="flex-shrink-0">{icon}</div>
      <AnimatePresence mode="wait">
        {!isCollapsed && (
          <motion.span
            key="label"
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.2 }}
            className="text-sm font-medium whitespace-nowrap overflow-hidden"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
      {!isCollapsed && <ChevronRight size={16} className="ml-auto" />}
    </Link>
  );
};

export default function SideNav() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  // Automatically collapse on mobile screens and track mobile state
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsCollapsed(true);
      }
    };

    // Set initial state
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Clean up
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const navItems = [
    { href: "/", icon: <Search size={20} />, label: "搜尋" },
    { href: "/summary", icon: <FileText size={20} />, label: "摘要列表" },
    { href: "/file", icon: <CloudUpload size={20} />, label: "上傳檔案" },
  ];

  return (
    <>
      <motion.aside
        initial={false}
        animate={{
          width: isCollapsed ? 80 : 240,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        // className="bg-neutral-500 fixed top-0 left-0 h-screen z-40 shadow-xl overflow-hidden"
        className="bg-gradient-to-br from-neutral-500 to-neutral-400 m-2 rounded-lg shadow-lg"
        style={{ minWidth: isCollapsed ? 80 : 240 }}
      >
        <div className="flex flex-col h-full">
          {/* Logo area */}
          <div className="p-6">
            <div className="flex items-center gap-3">
              <button
                className="z-50 p-2 bg-white dark:bg-neutral-800 shadow-md rounded-full
          hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                onClick={toggleSidebar}
                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {!isCollapsed ? <X size={18} /> : <Menu size={18} />}
              </button>
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.h1
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.3 }}
                    className="font-bold text-white text-xl whitespace-nowrap overflow-hidden"
                  >
                    HiRAG
                  </motion.h1>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Navigation links */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.href}>
                  <NavItem
                    href={item.href}
                    icon={item.icon}
                    label={item.label}
                    isActive={pathname === item.href}
                    isCollapsed={isCollapsed}
                  />
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer area - optional */}
          <div className="p-4 text-center">
            {!isCollapsed && <p className="text-xs text-white">© 2025 HiRAG</p>}
          </div>
        </div>
      </motion.aside>

      {/* Optional overlay for mobile - can be toggled with the sidebar */}
      <AnimatePresence>
        {!isCollapsed && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-30"
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>
    </>
  );
}
