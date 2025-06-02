import { Comment } from "@/components/ui/comment";
import React from "react";
import { getNoteComments, getNoteData } from "./getNoteData";
import { Skeleton } from "@/components/ui/skeleton";
import { Session } from "@supabase/supabase-js";

export function ListCommentSkeleton() {
  return Array.from({ length: 5 }).map((_, i) => (
    <Skeleton key={i} className="w-full h-8" />
  ));
}

export default async function ListComment({
  noteId,
  session,
}: {
  noteId: string;
  session: Session;
}) {
  const { access_token: token } = session;
  const { user_id } = await getNoteData(noteId, token);
  const comments = await getNoteComments(noteId, user_id, token);

  return (
    <>
      {comments?.user_comment && (
        <Comment
          className="border-neutral-300/70"
          comment={comments.user_comment.review}
          date={comments.user_comment.create_time}
        />
      )}
      {comments?.note_comments &&
        comments?.note_comments?.map((c, i) => (
          <Comment key={i} comment={c.review} date={c.create_time} />
        ))}
      {!comments?.note_comments && !comments?.user_comment && (
        <div className="flex items-center justify-center text-neutral-400 col-span-2">
          <p>No Reviews</p>
        </div>
      )}
    </>
  );
}
