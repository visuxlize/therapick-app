"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/landing/container";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "Is TodoFlow safe to use?", // {common trust/safety question about {app name}}
    answer:
      "Yes. TodoFlow stores your data securely and never shares it with third parties. We use industry-standard encryption and follow best practices for data protection.", // {reassuring answer about security/privacy}
  },
  {
    question: "How does TodoFlow help me stay organized?", // {question about core value prop of {app name}}
    answer:
      "TodoFlow lets you capture tasks instantly, organize them with priorities and filters, and track your progress. The minimal interface keeps you focused on what matters without clutter.", // {answer explaining the main workflow}
  },
  {
    question: "How is TodoFlow different from other task apps?", // {differentiator question — why {app name} vs competitors}
    answer:
      "TodoFlow is built for simplicity and speed. No bloat, no learning curve — just a clean interface that gets out of your way. It works beautifully on every device and syncs in real time.", // {answer highlighting unique selling points}
  },
];

export function LandingFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-20 sm:py-28">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left column - heading */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center rounded-full bg-muted px-4 py-1.5 text-sm font-medium text-muted-foreground">
                FAQ
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight"
            >
              All You Need to Know
            </motion.h2>
          </div>

          {/* Right column - accordion cards */}
          <div className="flex flex-col gap-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Collapsible
                  open={openIndex === i}
                  onOpenChange={(open) => setOpenIndex(open ? i : null)}
                >
                  <div className="rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-transparent hover:border-neutral-200 dark:hover:border-neutral-800 transition-colors">
                    <CollapsibleTrigger className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left">
                      <span className="font-medium text-foreground">
                        {faq.question}
                      </span>
                      <Plus
                        className={cn(
                          "w-5 h-5 shrink-0 text-muted-foreground transition-transform duration-200",
                          openIndex === i && "rotate-45"
                        )}
                      />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <p className="px-6 pb-5 pt-0 text-sm text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
