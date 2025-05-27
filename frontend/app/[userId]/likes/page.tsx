import { createClient } from "@/lib/supabase/server";
type LikedNote = {
  user_id: string;
  note_ids: number[];
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
  const noteIds = data.note_ids;

  return (
    <section className="w-full h-full">
      <hgroup className="wm-auto">
        <h1>Liked Notes for User</h1>
        <br />
        <div className="w-full">
          {noteIds.length === 0 ? (
            <p>No liked notes found.</p>
          ) : (
            <ul>
              {noteIds.map((id: number) => (
                <li key={id}>Note ID: {id}</li>
              ))}
            </ul>
          )}
        </div>
      </hgroup>
    </section>
  );
}
