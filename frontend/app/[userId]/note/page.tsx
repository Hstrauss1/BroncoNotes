import { Note } from "@/app/types";
import PdfThumbnail from "@/components/ui/PdfThumbnail";
import { createClient } from "@/lib/supabase/server";
import { getNotePdfBlob } from "./[noteId]/getNoteData";
import { redirect } from "next/navigation";
import Link from "next/link";
import Tag from "@/components/ui/tag";
type UserNote = {
  user_id: string;
  note_id: string;
  notes: Note[];
};

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

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/user/${userId}/notes`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!res.ok) {
    return (
      <section className="w-full h-full">
        <h1>Error fetching liked notes</h1>
      </section>
    );
  }

  const { notes } = (await res.json()) as UserNote;
  return (
    <section className="w-full h-full">
      <hgroup className="wm-auto">
        <h1 className="pt-10 pb-5">Notes</h1>
        {Array.isArray(notes) && notes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {notes.map(async (n: Note) => {
              const pdfBlob = await getNotePdfBlob(n.storage_path, token);
              const arrayBuffer = await pdfBlob.arrayBuffer();
              const base64 = Buffer.from(arrayBuffer).toString("base64");
              const pdfUrl = `data:application/pdf;base64,${base64}`;

              console.log(n.tags);

              return (
                <Link
                  key={n.note_id}
                  href={`note/${n.note_id}`}
                  className="p-4 border border-neutral-300/50 dark:border-neutral-700/50 rounded-xl bg-gradient-to-r from-neutral-100 to white dark:from-neutral-800 dark:to-neutral-900 flex flex-row justify-between items-center gap-4 hover:border-neutral-300 dark:hover:border-neutral-700"
                  prefetch
                >
                  <div className="flex-1 flex flex-col gap-1 h-full">
                    <div className="flex flex-wrap gap-1 pb-2">
                      {n.tags &&
                        n.tags.map((tag, index) => (
                          <Tag key={index} name={tag} className="text-xs" />
                        ))}
                    </div>
                    <hgroup className="grid gap-1 h-fit">
                      <h2 className="text-base text-black dark:text-white">
                        {n.title}
                      </h2>
                      <div className="text-sm opacity-50">
                        Likes: {n.votes ?? 0}
                      </div>
                    </hgroup>
                  </div>
                  <div className="flex-shrink-0">
                    <PdfThumbnail url={pdfUrl} height={100} />
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <p>No notes found.</p>
        )}
      </hgroup>
    </section>
  );
}
