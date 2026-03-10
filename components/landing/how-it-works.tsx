"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/landing/container";
import { ListPlus, FolderKanban, CircleCheckBig } from "lucide-react";
import { type ElementType } from "react";

const steps: {
  number: string;
  icon: ElementType;
  title: string;
  description: string;
  iconBg: string;
  iconColor: string;
}[] = [
  {
    number: "01",
    icon: ListPlus, // {pick a lucide-react icon that represents this step}
    title: "Capture", // {step 1 action verb, e.g. "Connect", "Upload", "Sign Up"}
    description:
      "Add tasks instantly with a clean, minimal interface. No friction — just type and go.", // {one-two sentences explaining this step}
    iconBg: "bg-rose-100 dark:bg-rose-950",
    iconColor: "text-rose-500",
  },
  {
    number: "02",
    icon: FolderKanban, // {pick a lucide-react icon that represents this step}
    title: "Organize", // {step 2 action verb, e.g. "Configure", "Customize", "Explore"}
    description:
      "Prioritize what matters. Sort, filter, and group your tasks to stay focused on the right things.", // {one-two sentences explaining this step}
    iconBg: "bg-amber-100 dark:bg-amber-950",
    iconColor: "text-amber-500",
  },
  {
    number: "03",
    icon: CircleCheckBig, // {pick a lucide-react icon that represents this step}
    title: "Complete", // {step 3 action verb, e.g. "Launch", "Ship", "Enjoy"}
    description:
      "Check off tasks and watch your progress grow. Stay motivated with a clear view of what you've accomplished.", // {one-two sentences explaining this step}
    iconBg: "bg-emerald-100 dark:bg-emerald-950",
    iconColor: "text-emerald-500",
  },
];

export function LandingHowItWorks() {
  return (
    <section id="how-it-works" className="py-20 sm:py-28">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left column - sticky heading */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center rounded-full border px-4 py-1.5 text-xs font-medium text-muted-foreground">
                How It Works
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight"
            >
              {/* {Achieve desired outcome with your product} — just three simple steps */}
              Get things done —{" "}
              <br className="hidden sm:block" />
              just three simple steps
            </motion.h2>
          </div>

          {/* Right column - stacking cards */}
          <div className="flex flex-col gap-6 lg:gap-0">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="lg:sticky rounded-2xl bg-neutral-100 dark:bg-neutral-900 p-6 sm:p-8 shadow-sm"
                style={{ top: `calc(6rem + ${i * 2.5}rem)` }}
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full shrink-0 ${step.iconBg}`}
                  >
                    <step.icon className={`w-5 h-5 ${step.iconColor}`} />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold tracking-tight">
                      {step.title}
                    </h3>
                    <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed max-w-sm">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Illustration placeholder */}
                <div className="mt-6 w-full h-48 rounded-xl bg-neutral-200 dark:bg-neutral-800" />

                {/* Step number */}
                <div className="mt-4 flex justify-end">
                  <span className="text-sm text-muted-foreground/50 font-medium tabular-nums">
                    {step.number}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
