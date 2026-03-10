"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { EmailForm } from "./email-form";
import { UserCounter } from "./user-counter";
import { WaitlistModal } from "./waitlist-modal";

export function HeroSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-20">
      <div className="max-w-4xl mx-auto text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-serif text-5xl md:text-7xl font-light leading-tight mb-16 text-white"
        >
          Join the waitlist for early access
          <br />
          to the{" "}
          <span className="text-[var(--tan-light)] italic">
            Mental Health Companion
          </span>
        </motion.h1>
        <motion.button
          type="button"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          onClick={() => setIsModalOpen(true)}
          className="bg-[var(--green-primary)] hover:bg-[var(--green-dark)] text-white px-16 py-5 rounded-full text-lg font-medium transition-all shadow-lg hover:shadow-2xl hover:shadow-[var(--green-primary)]/30 mb-12"
        >
          Take a peek
        </motion.button>
        <EmailForm onOpenModal={() => setIsModalOpen(true)} />
        <UserCounter />
      </div>
      <WaitlistModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
}
