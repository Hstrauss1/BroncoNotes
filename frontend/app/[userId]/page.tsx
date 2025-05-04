import { initializeUser } from "./initializeUser";

export default async function DefaultPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const data = await initializeUser(userId);

  return (
    <div className="p-6">
      <h1>Points</h1>
      <p>{data.points_tot}</p>
    </div>
  );
}
