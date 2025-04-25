export default async function DefaultPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  console.log(userId);
  return (
    <div className="p-6">
      <p>Welcome to the app!</p>
    </div>
  );
}
