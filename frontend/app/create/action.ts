"use server";

import { createClient } from "@/lib/supabase/server";

export const createNote = async (_: unknown, formData: FormData) => {
  const supabase = await createClient();
  const session = await supabase.auth.getSession();
  const token = session.data.session?.access_token;
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/upload-note`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      },
    );

    if (!response.ok) throw new Error("Upload failed");

    const data = await response.json();
    console.log("Note uploaded:", data);
    return {
      status: "success",
    };
  } catch (err) {
    console.error("Error uploading note:", err);
    return {
      status: "error",
    };
  }
};
