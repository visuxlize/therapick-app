"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/landing/container";
import { Play } from "lucide-react";

export function LandingDemo() {
  return (
    <section id="demo" className="relative py-20 sm:py-28 lg:py-32">
      <Container className="flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center max-w-2xl mx-auto"
        >
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-muted text-muted-foreground mb-4">
            Demo
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            {/* See {app name} in Action */}
            See it in Action
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative mt-12 w-full max-w-4xl"
        >
          <div className="relative w-full aspect-video rounded-2xl bg-neutral-200 dark:bg-neutral-800 overflow-hidden flex items-center justify-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="absolute inset-0 flex items-center justify-center cursor-pointer"
            >
              <div className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-foreground/90 text-background shadow-lg">
                <Play className="w-7 h-7 sm:w-8 sm:h-8 ml-1" fill="currentColor" />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
