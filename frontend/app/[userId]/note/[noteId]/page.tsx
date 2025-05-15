import { Button } from "@/components/ui/button";
import { getNoteComments, getNoteData, getNotePdfBlob } from "./getNoteData";
import { Lock, ThumbsUp } from "lucide-react";
import PdfThumbnail from "@/components/ui/PdfThumbnail";
import { Comment } from "@/components/ui/comment";
import { getUser } from "@/app/[userId]/initializeUser";
import { createClient } from "@/lib/supabase/server";

export default async function NotePage({
  params,
}: {
  params: Promise<{ noteId: string }>;
}) {
  const { noteId } = await params;
  const supabase = await createClient();
  const session = await supabase.auth.getSession();
  const token = session.data.session?.access_token;

  if (!token) {
    return null; // Handle the case when the token is not available
  }
  const note = await getNoteData(noteId, token);
  const pdfBlob = await getNotePdfBlob(note.storage_path);
  const user = await getUser(note.user_id, token);
  const comments = await getNoteComments(noteId, note.user_id, token);

  // Convert Blob to ArrayBuffer on the server and pass as data URL
  const arrayBuffer = await pdfBlob.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");
  const pdfUrl = `data:application/pdf;base64,${base64}`;

  return (
    <div className="flex flex-col h-full">
      <div className="bg-gradient-to-t from-neutral-50 to-transparent">
        <section className="wm-auto flex justify-between gap-12 items-center py-16">
          <div className="grid gap-6 h-fit">
            <hgroup className="grid gap-2">
              <h1>{note.title}</h1>
              <p className="text-md text-neutral-800">
                Uploaded by {user.name}
              </p>
            </hgroup>
            <div className="flex items-center gap-2">
              <Button variant="action" size="sm" className="w-fit">
                <Lock />
                Unlock with {note.cost} Points
              </Button>
              <Button variant="secondary" size="sm">
                <ThumbsUp />
                {note.votes} Likes
              </Button>
            </div>
          </div>
          <PdfThumbnail url={pdfUrl} height={150} />
        </section>
      </div>
      <hr />
      <section className="wm-auto py-12 flex-1 flex flex-col h-full">
        {comments.note_comments || comments.user_comment ? (
          <div>
            <div className="flex items-center justify-between">
              <h4>Reviews</h4>
            </div>
            <div className="grid grid-cols-2 gap-2 py-4">
              {comments.user_comment && (
                <Comment
                  className="border-neutral-300/70"
                  comment={comments.user_comment.review}
                  date={comments.user_comment.create_time}
                />
              )}
              {comments.note_comments?.map((c, i) => (
                <Comment key={i} comment={c.review} date={c.create_time} />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center text-neutral-400">
            <p>No Reviews</p>
          </div>
        )}
      </section>
    </div>
  );
}
