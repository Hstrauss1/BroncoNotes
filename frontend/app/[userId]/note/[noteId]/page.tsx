export default async function NotePage({
  params,
}: {
  params: Promise<{ userId: string; noteId: string }>;
}) {
  const { userId } = await params;
  console.log(userId);
  return (
    <div>
      <hgroup className="p-6">
        <h3>Class Name</h3>
        <h1>Note Title</h1>
      </hgroup>
    </div>
  );
}
