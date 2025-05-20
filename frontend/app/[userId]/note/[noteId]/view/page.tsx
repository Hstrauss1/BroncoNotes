import PdfViewer from "@/components/PdfViewer";
import { getNoteData, getNotePdfBlob } from "../getNoteData";
import { createClient } from "@/lib/supabase/server";

export default async function ViewPage({
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
  const pdfBlob = await getNotePdfBlob(note.storage_path, token);

  const arrayBuffer = await pdfBlob.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");
  const pdfUrl = `data:application/pdf;base64,${base64}`;

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
