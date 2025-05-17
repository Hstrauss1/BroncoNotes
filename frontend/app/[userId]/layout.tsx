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
        <div className="border-b border-neutral-300/70 bg-white sticky top-0 h-11 flex items-center px-2 z-10">
          <SidebarTrigger />
        </div>
        <div className="flex-1">{children}</div>
        <CommandMenu />
      </main>
    </SidebarProvider>
  );
}
