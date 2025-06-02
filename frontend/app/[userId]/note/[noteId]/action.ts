"use server";

export const deleteNote = async (noteId: string, token: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/delete-note/${noteId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!res.ok) throw new Error("Failed to update note");
  return await res.json();
};

export const unlockNote = async (fromData: FormData, token: string) => {
  const note_id = fromData.get("note-id") as string;
  const user_id = fromData.get("user-id") as string;
  if (!user_id || !note_id) {
    throw new Error("User ID and Note ID are required");
  }
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/unlock_note`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        user_id,
        note_id,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to unlock note");
  }

  const result = await response.json();
  console.log("Note unlocked successfully:", result);
  return result;
};
