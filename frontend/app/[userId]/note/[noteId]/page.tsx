import { Button } from "@/components/ui/button";
import { getNoteData, getNotePdfBlob } from "./getNoteData";
import { Lock, ThumbsUp } from "lucide-react";
import { getUser } from "../../initializeUser";
import PdfThumbnail from "@/components/ui/PdfThumbnail";

export default async function NotePage({
  params,
}: {
  params: Promise<{ userId: string; noteId: string }>;
}) {
  const { noteId } = await params;
  const note = await getNoteData(noteId);
  const pdfBlob = await getNotePdfBlob(note.storage_path);
  const user = await getUser(note.user_id);

  console.log(note);
  // Convert Blob to ArrayBuffer on the server and pass as data URL
  const arrayBuffer = await pdfBlob.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");
  const pdfUrl = `data:application/pdf;base64,${base64}`;

  return (
    <div className="p-6">
      <section className="wm-auto flex justify-between items-center pt-6 pb-12">
        <div className="grid gap-6 h-fit">
          <hgroup className="grid gap-2">
            <h1>{note.title}</h1>
            <p className="text-md text-neutral-800">Uploaded by {user.name}</p>
          </hgroup>
          <Button variant="action" size="sm" className="w-fit">
            <Lock />
            Unlock with {note.cost} Points
          </Button>
        </div>
        <PdfThumbnail url={pdfUrl} height={150} />
      </section>
      <hr />
      <section className="wm-auto py-6">
        <div className="flex items-center justify-between">
          <h4>Comments</h4>
          <span className="flex items-center gap-2 text-neutral-600 text-sm">
            <ThumbsUp className="size-3.5" />
            {note.votes} Likes
          </span>
        </div>
      </section>
    </div>
  );
}
