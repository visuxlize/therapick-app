import { HeroSection } from "@/components/marketing/hero-section";
import { FeatureBlobs } from "@/components/marketing/feature-blobs";
import { UpdatesPanel } from "@/components/marketing/updates-panel";
import { AnimatedBackground } from "@/components/marketing/animated-background";

export default function LandingPage() {
  return (
    <main className="relative min-h-screen bg-[var(--bg-dark)]">
      <AnimatedBackground />
      <UpdatesPanel />
      <HeroSection />
      <FeatureBlobs />
    </main>
  );
}
