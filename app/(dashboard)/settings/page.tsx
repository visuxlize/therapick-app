"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  updateProfileSchema,
  type UpdateProfileInput,
} from "@/lib/validations/auth";
import { Loader2 } from "lucide-react";

type User = {
  id: string;
  email: string | null;
  name: string | null;
  location: {
    city?: string;
    state?: string;
    zip?: string;
  } | null;
  preferences: {
    notificationEmail?: boolean;
    moodReminders?: boolean;
    reminderTime?: string;
  } | null;
  createdAt: string;
};

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
  });

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (data?.user) {
          setUser(data.user);
          reset({
            name: data.user.name ?? "",
            location: data.user.location
              ? {
                  city: data.user.location.city ?? "",
                  state: data.user.location.state ?? "",
                  zip: data.user.location.zip ?? "",
                }
              : undefined,
            preferences: data.user.preferences ?? undefined,
          });
        }
      })
      .catch(() => {});
  }, [reset]);

  async function onSubmit(data: UpdateProfileInput) {
    setMessage(null);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        setMessage({ type: "error", text: json.error ?? "Failed to update" });
        return;
      }
      setMessage({ type: "success", text: "Profile updated." });
      if (json.user) setUser(json.user);
    } catch {
      setMessage({ type: "error", text: "Something went wrong" });
    }
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-white/60" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-serif text-3xl font-bold text-white">Settings</h1>
      <p className="mt-2 text-white/60">Manage your account and preferences.</p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-10 space-y-8 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
      >
        {message && (
          <p
            className={`rounded-lg px-4 py-3 text-sm ${
              message.type === "success"
                ? "bg-[#4CAF50]/20 text-[#81C784]"
                : "bg-red-500/20 text-red-400"
            }`}
          >
            {message.text}
          </p>
        )}

        <section>
          <h2 className="text-lg font-semibold text-white">Profile</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label
                htmlFor="name"
                className="mb-1.5 block text-sm font-medium text-white/80"
              >
                Name
              </label>
              <input
                id="name"
                type="text"
                {...register("name")}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:border-[#4CAF50] focus:outline-none focus:ring-1 focus:ring-[#4CAF50]"
                placeholder="Your name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-white/80"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={user.email ?? ""}
                readOnly
                disabled
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white/60"
              />
              <p className="mt-1 text-xs text-white/40">Email cannot be changed.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">Location</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div>
              <label
                htmlFor="city"
                className="mb-1.5 block text-sm font-medium text-white/80"
              >
                City
              </label>
              <input
                id="city"
                type="text"
                {...register("location.city")}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:border-[#4CAF50] focus:outline-none focus:ring-1 focus:ring-[#4CAF50]"
                placeholder="City"
              />
            </div>
            <div>
              <label
                htmlFor="state"
                className="mb-1.5 block text-sm font-medium text-white/80"
              >
                State
              </label>
              <input
                id="state"
                type="text"
                {...register("location.state")}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:border-[#4CAF50] focus:outline-none focus:ring-1 focus:ring-[#4CAF50]"
                placeholder="State"
              />
            </div>
            <div>
              <label
                htmlFor="zip"
                className="mb-1.5 block text-sm font-medium text-white/80"
              >
                ZIP
              </label>
              <input
                id="zip"
                type="text"
                {...register("location.zip")}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:border-[#4CAF50] focus:outline-none focus:ring-1 focus:ring-[#4CAF50]"
                placeholder="ZIP"
              />
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">Account</h2>
          <p className="mt-2 text-sm text-white/60">
            Member since{" "}
            {user.createdAt
              ? new Date(user.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })
              : "—"}
          </p>
        </section>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center justify-center rounded-lg bg-[#4CAF50] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#388E3C] disabled:opacity-50"
        >
          {isSubmitting ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            "Save changes"
          )}
        </button>
      </form>
    </div>
  );
}
