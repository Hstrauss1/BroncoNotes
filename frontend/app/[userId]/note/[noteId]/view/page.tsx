import PdfViewer from "@/components/PdfViewer";
import { getNoteData, getNotePdfBlob } from "../getNoteData";

export default async function ViewPage({
  params,
}: {
  params: Promise<{ noteId: string }>;
}) {
  const { noteId } = await params;
  const note = await getNoteData(noteId);
  const pdfBlob = await getNotePdfBlob(note.storage_path);

  const arrayBuffer = await pdfBlob.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");
  const pdfUrl = `data:application/pdf;base64,${base64}`;

  return (
    <div className="flex flex-col">
      <h1>{note.name}</h1>
      <PdfViewer
        url={pdfUrl}
        height={1000}
        className="flex flex-col items-center gap-2 p-6 bg-neutral-100 flex-1 h-full overflow-y-scroll"
      />
    </div>
  );
}
