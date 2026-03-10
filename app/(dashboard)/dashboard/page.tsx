"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, TrendingUp, Calendar, Users } from "lucide-react";

type User = { name: string | null; email: string | null };

export default function DashboardHomePage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => data?.user && setUser(data.user))
      .catch(() => {});
  }, []);

  const displayName = user?.name || user?.email || "there";

  const stats = [
    {
      label: "Saved Therapists",
      value: "0",
      icon: Heart,
      color: "text-[#4CAF50]",
      bg: "bg-[#4CAF50]/10",
    },
    {
      label: "Mood Entries",
      value: "0",
      icon: TrendingUp,
      color: "text-[#81C784]",
      bg: "bg-[#81C784]/10",
    },
    {
      label: "Streak",
      value: "0",
      icon: Calendar,
      color: "text-[#C5E1A5]",
      bg: "bg-[#C5E1A5]/10",
    },
    {
      label: "Therapists Viewed",
      value: "0",
      icon: Users,
      color: "text-[#81C784]",
      bg: "bg-[#81C784]/10",
    },
  ];

  return (
    <div className="max-w-4xl">
      <h1 className="font-serif text-3xl font-bold text-white">
        Welcome back, {displayName}
      </h1>
      <p className="mt-2 text-white/60">
        Here’s an overview of your mental health journey.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
            >
              <div
                className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${stat.bg} ${stat.color}`}
              >
                <Icon className="h-6 w-6" />
              </div>
              <p className="mt-4 text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-sm text-white/60">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <Link
          href="/discover"
          className="block rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-colors hover:border-[#4CAF50]/30 hover:bg-[#4CAF50]/5"
        >
          <h2 className="font-serif text-xl font-semibold text-white">
            Find Your Therapist
          </h2>
          <p className="mt-2 text-sm text-white/60">
            Browse and match with licensed therapists based on your needs.
          </p>
          <span className="mt-4 inline-block rounded-lg bg-[#4CAF50] px-4 py-2 text-sm font-semibold text-white hover:bg-[#388E3C]">
            Discover
          </span>
        </Link>

        <Link
          href="/mood-tracker"
          className="block rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-colors hover:border-[#C5E1A5]/30 hover:bg-[#C5E1A5]/5"
        >
          <h2 className="font-serif text-xl font-semibold text-white">
            Track Your Mood
          </h2>
          <p className="mt-2 text-sm text-white/60">
            Log how you’re feeling and see patterns over time.
          </p>
          <span className="mt-4 inline-block rounded-lg bg-[#C5E1A5] px-4 py-2 text-sm font-semibold text-[#0A0E1A] hover:bg-[#81C784]">
            Track mood
          </span>
        </Link>
      </div>
    </div>
  );
}
