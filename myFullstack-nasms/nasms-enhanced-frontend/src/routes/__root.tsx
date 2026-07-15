import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet, Link, createRootRouteWithContext,
  useRouter, HeadContent, Scripts, useNavigate, useLocation,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { getToken, getRole, clearSession } from "@/services/api";
import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

// Public routes never require a token
const PUBLIC_ROUTES = ["/", "/login", "/register"];
// Admin-only routes
const ADMIN_ROUTES  = ["/admin"];
// Farmer-only routes
const FARMER_ROUTES = ["/dashboard", "/loans"];

function NotFoundComponent() {
  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:"1rem", fontFamily:"sans-serif" }}>
      <div style={{ fontSize:"5rem" }}>🌾</div>
      <h1 style={{ fontSize:"2rem", color:"#1b5e20" }}>Page Not Found</h1>
      <p style={{ color:"#6b7280" }}>The page you're looking for doesn't exist.</p>
      <Link to="/" style={{ background:"#2e7d32", color:"white", padding:"0.6rem 1.5rem", borderRadius:"8px", textDecoration:"none", fontWeight:600 }}>
        Go Home
      </Link>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  useEffect(() => { reportLovableError(error, { boundary: "tanstack_root_error_component" }); }, [error]);
  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:"1rem", fontFamily:"sans-serif", padding:"2rem", textAlign:"center" }}>
      <div style={{ fontSize:"3rem" }}>⚠️</div>
      <h1 style={{ fontSize:"1.5rem", color:"#111827" }}>Something went wrong</h1>
      <p style={{ color:"#6b7280", maxWidth:"400px" }}>An unexpected error occurred. You can try refreshing or head back home.</p>
      <div style={{ display:"flex", gap:"0.75rem", flexWrap:"wrap", justifyContent:"center" }}>
        <button onClick={() => { router.invalidate(); reset(); }}
          style={{ background:"#2e7d32", color:"white", padding:"0.6rem 1.5rem", borderRadius:"8px", border:"none", cursor:"pointer", fontWeight:600, fontSize:"0.875rem" }}>
          Try Again
        </button>
        <a href="/" style={{ background:"#f3f4f6", color:"#374151", padding:"0.6rem 1.5rem", borderRadius:"8px", textDecoration:"none", fontWeight:600, fontSize:"0.875rem" }}>
          Go Home
        </a>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "NASMS – National Agricultural Support & Monitoring System" },
      { name: "description", content: "Government of Kenya digital services for farmers: loans, farm inputs, market access, weather and analytics." },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap" },
      { rel: "stylesheet", href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function AuthGuard({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token   = getToken();
    const role    = getRole();
    const path    = location.pathname;
    const isPublic = PUBLIC_ROUTES.some(r => path === r || path.startsWith(r + "/"));

    if (!token && !isPublic) {
      void navigate({ to: "/login", replace: true });
      return;
    }
    if (token && (path === "/login" || path === "/register")) {
      const dest = role === "ADMIN" ? "/admin" : "/dashboard";
      void navigate({ to: dest as any, replace: true });
      return;
    }
    if (token && ADMIN_ROUTES.some(r => path.startsWith(r)) && role !== "ADMIN") {
      void navigate({ to: "/dashboard", replace: true });
      return;
    }
  }, [location.pathname]);

  // Listen for forced logout (401s from axios interceptor)
  useEffect(() => {
    const handler = () => {
      clearSession();
      void navigate({ to: "/login", replace: true });
    };
    window.addEventListener("nasms:logout", handler);
    return () => window.removeEventListener("nasms:logout", handler);
  }, [navigate]);

  return <>{children}</>;
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthGuard>
        <Outlet />
      </AuthGuard>
    </QueryClientProvider>
  );
}
