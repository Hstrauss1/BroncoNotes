import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ListMyNotes from "./ListMyNotes";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default async function NotePage({
  params,
}: {
  params: Promise<{ userId: string; noteId: string }>;
}) {
  const { userId } = await params;
  const supabase = await createClient();
  const session = await supabase.auth.getSession();
  const token = session.data.session?.access_token;
  if (!token) redirect("/signin");

  return (
    <section className="w-full h-full">
      <hgroup className="wm-auto">
        <h1 className="pt-10 pb-5">My Notes</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Suspense
            fallback={Array(8)
              .fill(0)
              .map((_, index) => (
                <Skeleton
                  key={index}
                  className="p-4 bg-white dark:bg-neutral-800 border border-neutral-300/50 dark:border-neutral-700/50 rounded-xl shadow-xs flex flex-col gap-2 h-32"
                >
                  <Skeleton className="h-4 rounded w-3/4" />
                  <Skeleton className="h-3 rounded w-1/2" />
                </Skeleton>
              ))}
          >
            <ListMyNotes userId={userId} token={token} />
          </Suspense>
        </div>
      </hgroup>
    </section>
  );
}
