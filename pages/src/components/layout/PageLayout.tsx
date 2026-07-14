import type { ReactNode } from "react";
import { useLocation } from "react-router";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

interface PageLayoutProps {
  children: ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  // The editor is a full-height app view; keep the footer off of it
  const isEditor = useLocation().pathname === "/editor";

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />
      <main className="flex flex-1 flex-col">{children}</main>
      {!isEditor && <Footer />}
    </div>
  );
}
