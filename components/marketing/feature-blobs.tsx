"use client";

import { Check, MapPin, Phone, Activity } from "lucide-react";

const features = [
  {
    icon: Check,
    title: "Mood-Based Matching",
    description:
      "Find therapists who specialize in exactly what you need based on how you're feeling",
  },
  {
    icon: MapPin,
    title: "10,000+ Real Therapists",
    description:
      "Licensed professionals nationwide with verified credentials and specialties",
  },
  {
    icon: Phone,
    title: "Direct Contact",
    description:
      "Phone numbers, websites, and Google Maps directions to connect easily",
  },
  {
    icon: Activity,
    title: "Track Progress",
    description:
      "Daily mood tracking with insights to monitor your mental health journey",
  },
];

export function FeatureBlobs() {
  return (
    <section className="relative z-10 py-24 bg-gradient-to-b from-transparent to-[var(--green-primary)]/5">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="font-serif text-4xl md:text-6xl font-light text-center mb-4 text-white">
          You&apos;re in for a treat.
          <br />
          Expect <span className="text-[var(--tan-light)] italic">this</span> and
          so much more
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="relative bg-white/[0.02] border border-white/[0.08] rounded-[200px] p-12 text-center transition-all duration-300 hover:bg-[var(--green-primary)]/5 hover:border-[var(--green-primary)]/30 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[var(--green-primary)]/20 group"
              >
                <div className="w-16 h-16 mx-auto mb-6 bg-[var(--green-primary)]/10 rounded-full flex items-center justify-center group-hover:bg-[var(--green-primary)]/20 transition-colors">
                  <Icon className="w-8 h-8 text-[var(--green-primary)] stroke-[2]" />
                </div>
                <h3 className="text-lg font-semibold mb-3 text-[var(--tan-light)]">
                  {feature.title}
                </h3>
                <p className="text-sm text-white/60 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
        <p className="text-2xl md:text-3xl text-white/40 text-center mt-20 font-light">
          Stay tuned! We&apos;re cooking up something amazing,
          <br />
          and you&apos;re on the VIP list
        </p>
      </div>
    </section>
  );
}
