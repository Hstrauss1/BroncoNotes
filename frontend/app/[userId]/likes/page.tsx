import { Note } from "@/app/types";
import { createClient } from "@/lib/supabase/server";

type LikedNote = {
  user_id: string;
  notes: Note[];
};

export default async function LikesPage({
  params,
}: {
  params: { userId: string };
}) {
  const { userId } = params;
  const supabase = await createClient();
  const session = await supabase.auth.getSession();
  const token = session.data.session?.access_token;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/liked-notes/${userId}/notes`,
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

  const data = (await res.json()) as LikedNote;
  const noteIds = data.notes;
  console.log(data);
  return (
    <section className="w-full h-full">
      <hgroup className="wm-auto">
        <h1 className="pt-10 pb-5">Liked Notes</h1>
        <br />
        {noteIds.length > 0 ? (
          <div className="w-full grid gap-4">
            {noteIds.map((note) => (
              <div key={note.note_id} className="p-4 border rounded shadow">
                <h2 className="font-bold">{note.title}</h2>
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full text-center text-gray-500">
            No liked notes.
          </div>
        )}
      </hgroup>
    </section>
  );
}
