import { Note } from "@/app/types";
import NoteLink from "@/components/ui/note-link";
import React from "react";

export default async function ListMyNotes({
  userId,
  token,
}: {
  userId: string;
  token: string;
}) {
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

  const { notes } = (await res.json()) as {
    user_id: string;
    note_id: string;
    notes: Note[];
  };
  return (
    <>
      {Array.isArray(notes) && notes.length > 0 ? (
        notes.map((n: Note) => (
          <NoteLink key={n.note_id} note={n} token={token} />
        ))
      ) : (
        <p className="col-span-2">No notes found.</p>
      )}
    </>
  );
}
