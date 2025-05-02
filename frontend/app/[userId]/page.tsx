import { redirect } from "next/navigation";

export default async function DefaultPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/initialize-user`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
      }), // The body will contain the user data
    },
  );

  const user = await res.json();

  if (!res.ok) redirect("/error");
  return (
    <div className="p-6">
      <h1>Points</h1>
      <p>{user.points_tot}</p>
    </div>
  );
}
