"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight } from "lucide-react";

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

type EmailFormValues = z.infer<typeof emailSchema>;

interface EmailFormProps {
  onOpenModal: () => void;
}

export function EmailForm({ onOpenModal }: EmailFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
  });

  const onSubmit = (data: EmailFormValues) => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("waitlist_email", data.email);
    }
    onOpenModal();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="relative max-w-lg mx-auto mb-8"
    >
      <input
        {...register("email")}
        type="email"
        placeholder="youremail@gmail.com"
        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--border-focus)] focus:bg-white/[0.08] transition-all"
      />
      <button
        type="submit"
        className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--green-primary)] hover:text-[var(--green-light)] transition-all hover:translate-x-1"
        aria-label="Submit email"
      >
        <ArrowRight className="w-6 h-6" />
      </button>
      {errors.email && (
        <p className="text-red-400 text-sm mt-2">{errors.email.message}</p>
      )}
    </form>
  );
}
