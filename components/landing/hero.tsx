"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/landing/container";
import { ArrowRight, Check, Clock } from "lucide-react";

const features = [
  "Simple, clean task management", // {key feature of your product}
  "Organize and prioritize effortlessly", // {another key feature}
  "Track progress in real time", // {another key feature}
  "Works beautifully on every device", // {another key feature}
];

export function LandingHero() {
  return (
    <section className="relative py-20 sm:py-28 lg:py-32">
      <Container className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left column */}
        <div className="flex flex-col">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold tracking-tight leading-[1.1]"
          >
            {/* Finally fix {the problem you're solving}. {reinforcing phrase}. */}
            Finally get your
            <br />
            tasks done.{" "}
            <span className="text-muted-foreground">For good.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-md"
          >
            {/* The simplest way to {what your product does}. {key differentiator}. */}
            The simplest way to manage your tasks and boost your productivity.
            No clutter, just clarity.
          </motion.p>

          <motion.ul
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 space-y-3"
          >
            {features.map((feature) => (
              <li key={feature} className="flex items-center gap-3">
                <div className="flex items-center justify-center w-5 h-5 rounded-full">
                  <Check className="w-4 h-4 text-primary" strokeWidth={2.5} />
                </div>
                <span className="text-[15px] text-foreground">{feature}</span>
              </li>
            ))}
          </motion.ul>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="mt-10 flex flex-col sm:flex-row items-start gap-4"
          >
            <Link href="/todos">
              <Button
                size="lg"
                className="h-12 px-7 text-base font-medium rounded-full gap-2 group"
              >
                {/* {call to action, e.g. "Start Free Trial", "Get Started Free"} */}
                Get Started Free
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-4 flex items-center gap-1.5 text-sm text-muted-foreground"
          >
            {/* {quick social proof or setup time, e.g. "Set up in under 2 minutes", "Trusted by 1,000+ teams"} */}
            <Clock className="w-3.5 h-3.5" />
            Set up in under 2 minutes
          </motion.p>
        </div>

        {/* Right column - Image placeholder */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="relative"
        >
          <div className="w-full aspect-4/3 rounded-2xl bg-neutral-200 dark:bg-neutral-800" />
        </motion.div>
      </Container>
    </section>
  );
}
