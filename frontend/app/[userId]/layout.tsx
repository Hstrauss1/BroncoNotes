import { CommandMenu } from "@/components/CommandMenu";
import Link from "next/link";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex">
      <aside className="w-72 sticky top-0 h-screen">
        <nav className="w-full h-full bg-neutral-100 border-r border-neutral-200 p-6">
          <ul>
            <li>
              <Link href="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link href="/settings">Settings</Link>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="left-72 min-h-screen">
        {children}
        <CommandMenu />
      </main>
    </section>
  );
}
