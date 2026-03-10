"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/landing/container";

const topFeatures = [
  {
    title: "Quick Capture", // {short feature name, e.g. "Quick Capture", "Smart Search"}
    description: "Add tasks in seconds with a minimal, distraction-free interface.", // {one sentence explaining this feature's benefit}
  },
  {
    title: "Smart Organize", // {short feature name}
    description: "Automatically sort and prioritize tasks so nothing slips through.", // {one sentence explaining this feature's benefit}
  },
  {
    title: "Progress Tracking", // {short feature name}
    description: "See how much you've accomplished at a glance with visual insights.", // {one sentence explaining this feature's benefit}
  },
];

const bottomFeatures = [
  {
    title: "Built for Speed", // {short feature name, e.g. "Built for Speed", "Enterprise Security"}
    description:
      "Lightning-fast performance. No loading spinners, no waiting around. Your tasks are always ready.", // {two sentences explaining this feature's benefit}
  },
  {
    title: "100% Private", // {short feature name}
    description:
      "Your data stays yours. Everything is securely stored and never shared with third parties.", // {two sentences explaining this feature's benefit}
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
};

function FeatureCard({
  title,
  description,
  index,
}: {
  title: string;
  description: string;
  index: number;
}) {
  return (
    <motion.div
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={fadeUp}
      className="flex flex-col justify-between rounded-2xl bg-neutral-100 dark:bg-neutral-900 p-6 sm:p-8 min-h-[280px]"
    >
      <div>
        <h3 className="text-lg sm:text-xl font-semibold tracking-tight">
          {title}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-xs">
          {description}
        </p>
      </div>
      <div className="mt-6 w-full h-28 rounded-xl bg-neutral-200 dark:bg-neutral-800" />
    </motion.div>
  );
}

export function LandingFeatures() {
  return (
    <section id="features" className="py-20 sm:py-28">
      <Container>
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="flex justify-center"
        >
          <span className="inline-flex items-center rounded-full border px-4 py-1.5 text-xs font-medium text-muted-foreground">
            Features
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-center leading-tight"
        >
          {/* Everything you need to {achieve the desired outcome with your product} */}
          Everything You Need
          <br />
          to Stay on Track
        </motion.h2>

        {/* Top row - 3 cards */}
        <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {topFeatures.map((feature, i) => (
            <FeatureCard
              key={feature.title}
              title={feature.title}
              description={feature.description}
              index={i}
            />
          ))}
        </div>

        {/* Bottom row - 2 cards */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {bottomFeatures.map((feature, i) => (
            <FeatureCard
              key={feature.title}
              title={feature.title}
              description={feature.description}
              index={i + topFeatures.length}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
