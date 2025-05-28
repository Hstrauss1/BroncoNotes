import { Note } from "@/app/types";
import PdfThumbnail from "@/components/ui/PdfThumbnail";
import { createClient } from "@/lib/supabase/server";
import { getNotePdfBlob } from "./[noteId]/getNoteData";
import { redirect } from "next/navigation";
import Link from "next/link";
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
  if (!token) {
    redirect("/signin");
  }
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/user/${userId}/note-ids`,
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

  const data = (await res.json()) as UserNote;
  const noteIds = data.notes;
  return (
    <section className="w-full h-full">
      <hgroup className="wm-auto">
        <h1 className="my-5">Notes</h1>
        {Array.isArray(noteIds) && noteIds.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {noteIds.map(async (n: Note) => {
              const pdfBlob = await getNotePdfBlob(n.storage_path, token);
              const arrayBuffer = await pdfBlob.arrayBuffer();
              const base64 = Buffer.from(arrayBuffer).toString("base64");
              const pdfUrl = `data:application/pdf;base64,${base64}`;

              return (
                <Link
                  prefetch
                  key={n.note_id}
                  href={`note/${n.note_id}`}
                  className="p-4 border border-neutral-200 dark:border-neutral-700 rounded bg-neutral-100 dark:bg-neutral-900 flex flex-row justify-between items-center"
                >
                  <div className="flex flex-col flex-1 mr-4">
                    <h2 className="text-base font-semibold mb-2 text-black dark:text-white">
                      {n.title}
                    </h2>
                    <div className="text-sm text-black dark:text-neutral-300 mt-2">
                      Likes: {n.votes ?? 0}
                    </div>
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
