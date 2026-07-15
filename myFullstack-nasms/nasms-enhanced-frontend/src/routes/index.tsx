import { createFileRoute, Link, type LinkProps } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
// Assumes a TanStack Query hook exists (or is added) to fetch live platform stats.
// Swap this import for your actual data-fetching hook.
import { usePlatformStats, type PlatformStats } from "@/hooks/usePlatformStats";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NASMS – Home" },
      {
        name: "description",
        content:
          "Empowering Kenyan farmers through digital agriculture services: loans, inputs, market access, weather, and analytics.",
      },
      // Social sharing metadata
      { property: "og:title", content: "NASMS – National Agricultural Support & Monitoring System" },
      {
        property: "og:description",
        content:
          "Empowering Kenyan farmers through digital agriculture services: loans, inputs, market access, weather, and analytics.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://nasms.go.ke/" }],
  }),
  component: HomePage,
});

// --- Typed data -------------------------------------------------------

interface ServiceCard {
  id: string;
  to: LinkProps["to"]; // typed against the router's known routes — catches typos at compile time
  icon: string;
  iconLabel: string; // accessible label for the emoji icon
  title: string;
  desc: string;
}

export const SERVICES: ServiceCard[] = [
  {
    id: "monitoring",
    to: "/dashboard",
    icon: "👨‍🌾",
    iconLabel: "Farmer monitoring",
    title: "Farmer Monitoring",
    desc: "Track farmer profiles, land details, production data, and compliance across all counties.",
  },
  {
    id: "loans",
    to: "/loans",
    icon: "💰",
    iconLabel: "Government loans",
    title: "Government Loans",
    desc: "Access subsidised credit facilities and government-backed financing for your farm.",
  },
  {
    id: "inputs",
    to: "/products",
    icon: "🌱",
    iconLabel: "Farm inputs",
    title: "Farm Inputs",
    desc: "Request certified seeds, fertilizers, pesticides, and equipment through our portal.",
  },
  {
    id: "market",
    to: "/market",
    icon: "🏪",
    iconLabel: "Market access",
    title: "Market Access",
    desc: "Connect with verified buyers and sellers to get fair prices for your produce.",
  },
  {
    id: "weather",
    to: "/weather",
    icon: "🌤",
    iconLabel: "Weather predictions",
    title: "Weather Predictions",
    desc: "Real-time and 7-day forecasts tailored to your farm's region and season.",
  },
  {
    id: "analytics",
    to: "/analytics",
    icon: "📊",
    iconLabel: "Production analytics",
    title: "Production Analytics",
    desc: "Visualise crop performance, yields, and farm trends with interactive reports.",
  },
];

interface StatItem {
  id: keyof PlatformStats;
  label: string;
  // Formats a raw numeric/string value from the API into display text (e.g. "2.1M+", "KES 8B")
  format: (value: string | number) => string;
}

const STAT_DEFINITIONS: StatItem[] = [
  { id: "farmers", label: "Registered Farmers", format: (v) => `${v}` },
  { id: "loansDisbursed", label: "Loans Disbursed", format: (v) => `${v}` },
  { id: "counties", label: "Counties Served", format: (v) => `${v}` },
  { id: "satisfaction", label: "Satisfaction Rate", format: (v) => `${v}` },
];

// --- Component ----------------------------------------------------------

function HomePage() {
  // Falls back to last-known-good static copy while loading or on error,
  // so the hero never renders empty/broken numbers.
  const { data: stats, isLoading, isError } = usePlatformStats();

  const fallbackStats: PlatformStats = {
    farmers: "2.1M+",
    loansDisbursed: "KES 8B",
    counties: "47",
    satisfaction: "94%",
  };

  const displayStats: PlatformStats = isLoading || isError ? fallbackStats : stats ?? fallbackStats;

  return (
    <Layout padded={false}>
      <section className="hero">
        <div className="hero-bg" aria-hidden="true" />
        <div className="hero-overlay" aria-hidden="true" />
        <div className="hero-content">
          <div className="hero-badge animate animate-delay-1">
            <i className="fa fa-shield-halved" aria-hidden="true" /> Government of Kenya — Ministry
            of Agriculture
          </div>
          <h1 className="animate animate-delay-1">
            Empowering Farmers Through <em>Digital Agriculture</em> Services
          </h1>
          <p className="animate animate-delay-2">
            The National Agricultural Support &amp; Monitoring System provides farmers with
            seamless access to government loans, certified farm inputs, market linkages, and
            real-time production insights.
          </p>
          <div className="hero-btns animate animate-delay-2">
            <Link to="/register" className="btn btn-primary">
              <i className="fa fa-user-plus" aria-hidden="true" /> Register as Farmer
            </Link>
            <Link to="/login" className="btn btn-outline">
              <i className="fa fa-sign-in-alt" aria-hidden="true" /> Sign In
            </Link>
          </div>
          <dl className="hero-stats animate animate-delay-3">
            {STAT_DEFINITIONS.map((stat) => (
              <div className="hero-stat" key={stat.id}>
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <strong>{displayStats[stat.id] ?? "—"}</strong>
                </dd>
                <span aria-hidden="true">{stat.label}</span>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="section" style={{ background: "white" }}>
        <div className="section-inner">
          <div className="section-label">Our Services</div>
          <h2 className="section-title">Everything a Farmer Needs, in One Place</h2>
          <p className="section-sub">
            From financial support to market access, we provide comprehensive services to
            modernise Kenyan agriculture.
          </p>
          <div className="services-grid">
            {SERVICES.map((s) => (
              <Link key={s.id} to={s.to} className="service-card">
                <div className="service-icon" role="img" aria-label={s.iconLabel}>
                  {s.icon}
                </div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-banner">
        <div className="section-inner cta-banner-inner">
          <div className="section-label cta-label">Get Started Today</div>
          <h2 className="section-title cta-title">
            Join Thousands of Farmers Benefiting from NASMS
          </h2>
          <p className="cta-sub">
            Registration is free and takes under 5 minutes. You&apos;ll immediately access all
            government services.
          </p>
          <Link to="/register" className="btn btn-primary">
            <i className="fa fa-leaf" aria-hidden="true" /> Register for Free
          </Link>
        </div>
      </section>
    </Layout>
  );
}