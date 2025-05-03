"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const getUserData = async (userId: string) => {
  const supabase = await createClient();
  const session = await supabase.auth.getSession();
  const token = session.data.session?.access_token;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/initialize-user`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        user_id: userId,
      }), // The body will contain the user data
    },
  );

  if (!res.ok) redirect("/error");
  return await res.json();
};
