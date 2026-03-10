import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/supabase/server";
import { trpc } from "@/lib/trpc/server";
import { AuthProvider } from "@/components/auth/auth-provider";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user: authUser, error } = await getAuthUser();

  if (error || !authUser) {
    redirect("/auth/login");
  }

  const user = await trpc.users.me();

  return (
    <AuthProvider user={user}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
    </AuthProvider>
  );
}
