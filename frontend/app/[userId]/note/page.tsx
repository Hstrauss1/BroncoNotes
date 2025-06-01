import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ListMyNotes from "./ListMyNotes";
import { Suspense } from "react";

export default async function NotePage({
  params,
}: {
  params: { userId: string; noteId: string };
}) {
  const { userId } = params;
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
            fallback={
              <>
                {Array(8)
                  .fill(0)
                  .map((_, index) => (
                    <div
                      key={index}
                      className="p-4 border border-neutral-200 rounded-xl shadow-xs animate-pulse flex flex-col gap-2 h-32"
                    >
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
              </>
            }
          >
            <ListMyNotes userId={userId} token={token} />
          </Suspense>
        </div>
      </hgroup>
    </section>
  );
}
