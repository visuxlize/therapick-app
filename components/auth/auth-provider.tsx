"use client"

import { createContext, useContext } from "react"
import type { users } from "@/db/schema"
import type { InferSelectModel } from "drizzle-orm"

export type AuthUser = InferSelectModel<typeof users>

const AuthContext = createContext<AuthUser | null>(null)

export function AuthProvider({
  user,
  children,
}: {
  user: AuthUser
  children: React.ReactNode
}) {
  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const user = useContext(AuthContext)
  if (!user) {
    throw new Error("useAuth must be used within an AuthProvider.")
  }
  return user
}
