export default async function DefaultPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;

  return <div className="p-6"></div>;
}
