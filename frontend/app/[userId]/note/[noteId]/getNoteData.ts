"use server";

import { Comment, Note } from "@/app/types";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const getNoteData = async (noteId: string, token: string) => {
  const noteRes = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/note/${noteId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!noteRes.ok) redirect("/error");
  return (await noteRes.json()) as Note;
};

export const getNoteAuthor = async (authorId: string) => {
  const supabase = await createClient();
  const user = (await supabase.auth.getUser(authorId)).data.user;
  console.log(user?.email);
};

// Separate server action to fetch the PDF data as a Blob
export const getNotePdfBlob = async (storagePath: string) => {
  const supabase = await createClient();
  const session = await supabase.auth.getSession();
  const token = session.data.session?.access_token;

  const storageRes = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/storage`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ storage_path: storagePath }),
    }
  );

  if (!storageRes.ok) redirect("/error");
  return await storageRes.blob();
};

export const getUserComments = async (userId: string, token: string) => {
  const commentRes = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/comments/${userId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!commentRes.ok) redirect("/error");
  return (await commentRes.json()) as Comment;
};

export const getNoteComments = async (
  noteId: string,
  userId: string,
  token: string
) => {
  const commentsRes = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/note/${noteId}/comments/${userId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!commentsRes.ok) redirect("/error");
  return (await commentsRes.json()) as {
    note_comments: Comment[];
    user_comment: Comment;
  };
};
