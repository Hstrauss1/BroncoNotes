import { CommandMenu } from "@/app/[userId]/CommandMenu";
import { cookies } from "next/headers";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <main className="flex flex-col flex-1">
        <div className="p-2.5">
          <SidebarTrigger />
        </div>
        {children}
        <CommandMenu />
      </main>
    </SidebarProvider>
  );
}
