import { CommandMenu } from "@/app/[userId]/CommandMenu";
import { cookies } from "next/headers";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AppLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ userId: string }>;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";
  const { userId } = await params;
  const supabase = await createClient();
  const currentUser = (await supabase.auth.getUser()).data.user;
  if (!currentUser || userId !== currentUser.id) redirect("/signin");

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar userId={userId} />
      <main className="flex flex-col flex-1">
        <div className="p-2.5">
          <SidebarTrigger />
        </div>
        {children}
        <CommandMenu userId={userId} />
      </main>
    </SidebarProvider>
  );
}
