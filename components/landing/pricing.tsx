"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "@/components/landing/container";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const plans = [
  {
    title: "Starter", // {lower tier name, e.g. "Starter", "Basic", "Hobby"}
    price: "$9", // {monthly price}
    originalPrice: "$19", // {original price before discount, or remove if no discount}
    period: "/month",
    description: "Perfect for getting started", // {who this plan is for, e.g. "Perfect for individuals"}
    features: [
      "Up to 100 tasks", // {plan feature — what's included or limited}
      "Basic organization", // {plan feature}
      "Email support", // {plan feature}
      "1 workspace", // {plan feature}
    ],
    cta: "Get Started", // {button text, e.g. "Get Started", "Try Free"}
    href: "/todos", // {link to app or signup}
    highlighted: false,
  },
  {
    title: "Pro", // {higher tier name, e.g. "Pro", "Team", "Business"}
    price: "$29", // {monthly price}
    originalPrice: "$59", // {original price before discount, or remove if no discount}
    period: "/month",
    description: "For power users who need more", // {who this plan is for, e.g. "For growing teams"}
    features: [
      "Unlimited tasks", // {plan feature — what's included or upgraded}
      "Advanced filters & views", // {plan feature}
      "Priority support", // {plan feature}
      "Unlimited workspaces", // {plan feature}
      "Export & integrations", // {plan feature}
    ],
    cta: "Start Free Trial", // {button text}
    href: "/todos", // {link to app or signup}
    highlighted: true,
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

function PricingCard({
  plan,
  index,
}: {
  plan: (typeof plans)[0];
  index: number;
}) {
  return (
    <motion.div
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={fadeUp}
      className={`flex flex-col rounded-2xl p-6 sm:p-8 min-h-[420px] ${
        plan.highlighted
          ? "bg-neutral-900 dark:bg-neutral-950 text-white shadow-xl ring-1 ring-neutral-800"
          : "bg-neutral-100 dark:bg-neutral-900"
      }`}
    >
      <h3 className="text-lg font-semibold tracking-tight">{plan.title}</h3>
      <p
        className={`mt-1 text-sm ${
          plan.highlighted ? "text-neutral-400" : "text-muted-foreground"
        }`}
      >
        {plan.description}
      </p>

      <div className="mt-6 flex items-baseline gap-2">
        <span className="text-3xl sm:text-4xl font-bold tracking-tight">
          {plan.price}
        </span>
        <span
          className={
            plan.highlighted ? "text-neutral-400" : "text-muted-foreground"
          }
        >
          {plan.period}
        </span>
        {plan.originalPrice && (
          <span
            className={`ml-2 text-sm line-through ${
              plan.highlighted ? "text-neutral-500" : "text-muted-foreground"
            }`}
          >
            {plan.originalPrice}
          </span>
        )}
      </div>

      <Link href={plan.href} className="mt-6">
        <Button
          size="lg"
          className={`w-full rounded-full h-12 font-medium ${
            plan.highlighted
              ? "bg-white text-neutral-900 hover:bg-neutral-100"
              : ""
          }`}
        >
          {plan.cta}
        </Button>
      </Link>

      <ul className="mt-6 space-y-3">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-center gap-3">
            <Check
              className={`w-4 h-4 shrink-0 ${
                plan.highlighted ? "text-emerald-400" : "text-primary"
              }`}
              strokeWidth={2.5}
            />
            <span
              className={`text-sm ${
                plan.highlighted ? "text-neutral-300" : "text-foreground"
              }`}
            >
              {feature}
            </span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export function LandingPricing() {
  return (
    <section id="pricing" className="py-20 sm:py-28">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="flex justify-center"
        >
          <span className="inline-flex items-center rounded-full bg-muted px-4 py-1.5 text-sm font-medium text-muted-foreground">
            Pricing
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-center"
        >
          Simple, transparent pricing
        </motion.h2>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {plans.map((plan, i) => (
            <PricingCard key={plan.title} plan={plan} index={i} />
          ))}
        </div>
      </Container>
    </section>
  );
}
