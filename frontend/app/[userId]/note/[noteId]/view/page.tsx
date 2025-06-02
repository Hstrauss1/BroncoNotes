import PdfViewer from "@/components/PdfViewer";
import { getNoteData, getNotePdfBlob } from "../getNoteData";
import { createClient } from "@/lib/supabase/server";
import { isNoteUnlocked } from "../action";

export default async function ViewPage({
  params,
}: {
  params: Promise<{ noteId: string }>;
}) {
  const { noteId } = await params;

  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) return null;

  const {
    user: { id: userId },
    access_token: token,
  } = session;

  const note = await getNoteData(noteId, token);
  const pdfBlob = await getNotePdfBlob(note.storage_path, token);

  const arrayBuffer = await pdfBlob.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");
  const pdfUrl = `data:application/pdf;base64,${base64}`;

  const { is_unlocked } = await isNoteUnlocked(note.note_id, userId, token);

  if (!is_unlocked) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 h-full">
        <h1>Note is locked</h1>
        <p>Please unlock the note to view its content.</p>
        {/* Add your unlock note component here */}
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <PdfViewer
        url={pdfUrl}
        height={1000}
        className="flex flex-col items-center gap-2 p-6 bg-neutral-100 dark:bg-neutral-900 flex-1 h-full overflow-y-scroll"
      />
    </div>
  );
}
