import { useEffect, type ReactNode } from "react";
import { Nav } from "./Nav";
import { Footer } from "./Footer";

interface LayoutProps {
  children: ReactNode;
  /** If true, the body gets `app-padded` (default). Pass false for full-bleed hero pages. */
  padded?: boolean;
  hideFooter?: boolean;
}

/**
 * Top-level page shell with Nav + Footer.
 * Toggles a `app-padded` class on <body> so hero pages can sit under the nav.
 */
export function Layout({ children, padded = true, hideFooter = false }: LayoutProps) {
  useEffect(() => {
    const cls = "app-padded";
    if (padded) document.body.classList.add(cls);
    else document.body.classList.remove(cls);
    return () => document.body.classList.remove(cls);
  }, [padded]);

  return (
    <>
      <Nav />
      {children}
      {!hideFooter && <Footer />}
    </>
  );
}
