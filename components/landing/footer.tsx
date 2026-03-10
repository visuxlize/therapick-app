import Link from "next/link";
import { Container } from "@/components/landing/container";

function LogoIcon() {
  return (
    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
      <svg
        className="w-4.5 h-4.5 text-primary"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9 11l3 3L22 4"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

// {add or remove footer link groups and links to match your app's pages}
const linkGroups = [
  {
    heading: "Links",
    links: [
      { label: "Home", href: "/" },
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "Contact", href: "#contact" },
    ],
  },
  {
    heading: "Manage",
    links: [{ label: "Manage your account", href: "/todos" }],
  },
];

export function LandingFooter() {
  return (
    <footer id="contact" className="border-t bg-muted/30 py-12 sm:py-16">
      <Container>
        <div className="flex flex-col sm:flex-row gap-10 sm:gap-16">
          {/* Branding */}
          <Link
            href="/"
            className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
          >
            <LogoIcon />
            {/* {app name} — split into two parts for styling: "{first part}" and "{styled part}" */}
            <span className="text-[17px] font-semibold tracking-tight">
              Todo<span className="text-primary">Flow</span>
            </span>
          </Link>

          {/* Link groups */}
          <div className="flex flex-wrap gap-10 sm:gap-16">
            {linkGroups.map((group) => (
              <div key={group.heading}>
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">
                  {group.heading}
                </h3>
                <ul className="space-y-3">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-foreground hover:text-primary transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
