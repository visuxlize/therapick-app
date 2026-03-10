"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Heart, Check, Mail } from "lucide-react";
import { trpc } from "@/lib/trpc/client";

const waitlistSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
});

type FormData = z.infer<typeof waitlistSchema>;

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
  const [isSuccess, setIsSuccess] = useState(false);
  const [userData, setUserData] = useState<{
    email: string;
    position: number;
    referralCode: string;
  } | null>(null);

  const utils = trpc.useUtils();
  const joinMutation = trpc.waitlist.join.useMutation({
    onSuccess: (data) => {
      setUserData({
        email: data.email,
        position: data.position,
        referralCode: data.referralCode,
      });
      setIsSuccess(true);
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("waitlist_email");
      }
      void utils.waitlist.getCount.invalidate();
    },
  });

  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue } = useForm<FormData>({
    resolver: zodResolver(waitlistSchema),
    defaultValues: { name: "", email: "" },
  });

  useEffect(() => {
    if (isOpen && typeof window !== "undefined") {
      const stored = sessionStorage.getItem("waitlist_email");
      if (stored) setValue("email", stored);
    }
  }, [isOpen, setValue]);

  const onSubmit = (data: FormData) => {
    joinMutation.mutate({ name: data.name, email: data.email });
  };

  const handleClose = () => {
    setIsSuccess(false);
    setUserData(null);
    onClose();
  };

  const errorMessage = joinMutation.error?.message;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-md bg-gradient-to-br from-[var(--green-primary)]/5 to-[var(--tan-light)]/5 border border-[var(--green-primary)]/20 backdrop-blur-xl"
      >
        {!isSuccess ? (
          <div className="p-6">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[var(--green-primary)] to-[var(--green-light)] rounded-full flex items-center justify-center">
              <Heart className="w-10 h-10 text-white" fill="white" />
            </div>
            <h2 className="font-serif text-3xl font-bold text-center mb-3 text-white">
              Join Therapick
            </h2>
            <p className="text-center text-white/60 mb-8">
              Get early access to the mental health companion
            </p>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <input
                  {...register("name")}
                  placeholder="Full name"
                  className="w-full bg-white/5 border border-white/15 rounded-2xl px-6 py-4 text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--green-primary)] focus:bg-white/[0.08] transition-all"
                />
                {errors.name && (
                  <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>
              <div>
                <input
                  {...register("email")}
                  type="email"
                  placeholder="Email address"
                  className="w-full bg-white/5 border border-white/15 rounded-2xl px-6 py-4 text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--green-primary)] focus:bg-white/[0.08] transition-all"
                />
                {errors.email && (
                  <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>
              {errorMessage && (
                <p className="text-red-400 text-sm">{errorMessage}</p>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[var(--green-primary)] hover:bg-[var(--green-dark)] text-white py-4 rounded-2xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Joining..." : "Continue"}
              </button>
            </form>
            <button
              type="button"
              onClick={handleClose}
              className="w-full mt-4 text-white/40 hover:text-white/60 text-sm transition-colors"
            >
              Maybe later
            </button>
          </div>
        ) : (
          <div className="p-6 text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-[var(--green-primary)] rounded-full flex items-center justify-center animate-in zoom-in duration-500">
              <Check className="w-12 h-12 text-white stroke-[3]" />
            </div>
            <h2 className="font-serif text-3xl font-bold mb-3 text-white">
              You are now part of the waitlist!
            </h2>
            <p className="text-white/60 mb-2">We&apos;ll notify you when we launch</p>
            <p className="text-2xl font-semibold text-[var(--green-primary)] mb-8">
              Coming soon to iOS - Q3 2026
            </p>
            {userData && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-white/60 shrink-0" />
                  <span className="flex-1 text-left text-sm text-white truncate">
                    {userData.email}
                  </span>
                  <span className="text-xs text-white/40 font-semibold shrink-0">
                    #{userData.position}
                  </span>
                </div>
              </div>
            )}
            <button
              type="button"
              onClick={handleClose}
              className="w-full bg-[var(--green-primary)] hover:bg-[var(--green-dark)] text-white py-4 rounded-2xl font-semibold transition-all"
            >
              Done
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
