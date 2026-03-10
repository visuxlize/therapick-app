"use client";

import { useState } from "react";
import { X, LayoutGrid } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const liveNowUpdates = [
  {
    date: "March 10, 2026",
    text: "Waitlist page is live! We're collecting early signups and building the MVP.",
  },
];

const comingSoonUpdates = [
  {
    date: "March 8, 2026",
    text: "Complete therapist matching algorithm. Testing mood-based recommendations with real data.",
  },
  {
    date: "March 5, 2026",
    text: "Integrate with TheraAPI. We now have access to 10,000+ licensed therapists nationwide.",
  },
  {
    date: "March 1, 2026",
    text: "Start iOS app development. SwiftUI + full HIPAA compliance infrastructure in place.",
  },
];

export function UpdatesPanel() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-6 right-6 z-50 bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white text-sm flex items-center gap-2 hover:bg-white/[0.08] transition-all backdrop-blur-sm"
        aria-label={isOpen ? "Close updates" : "Open updates"}
      >
        <LayoutGrid className="w-4 h-4" />
        Updates
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: 440, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 440, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-20 right-6 w-96 max-h-[600px] bg-black/95 backdrop-blur-xl border border-white/10 rounded-3xl p-6 z-50 overflow-y-auto scrollbar-therapick"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">
                Development Updates
              </h3>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-white/40 hover:text-white transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-6">
              <section>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--green-primary)] mb-3">
                  Live now
                </h4>
                <div className="space-y-4">
                  {liveNowUpdates.map((update, index) => (
                    <motion.div
                      key={`live-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5 hover:bg-[var(--green-primary)]/5 hover:border-[var(--green-primary)]/20 transition-all"
                    >
                      <p className="text-xs text-white/40 mb-2">{update.date}</p>
                      <p className="text-sm text-white/80 leading-relaxed">
                        {update.text}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </section>
              <section>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-white/50 mb-3">
                  Coming soon
                </h4>
                <div className="space-y-4">
                  {comingSoonUpdates.map((update, index) => (
                    <motion.div
                      key={`soon-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: (liveNowUpdates.length + index) * 0.1 }}
                      className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5 hover:bg-[var(--green-primary)]/5 hover:border-[var(--green-primary)]/20 transition-all"
                    >
                      <p className="text-sm text-white/80 leading-relaxed">
                        {update.text}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </section>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
