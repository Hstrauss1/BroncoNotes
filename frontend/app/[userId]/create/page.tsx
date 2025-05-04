"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useParams } from "next/navigation";
import { useActionState, useEffect } from "react";
import { createNote } from "./action";
import { Loader, PlusSquare } from "lucide-react";
import { toast } from "sonner";

export default function CreatePage() {
  const { userId } = useParams<{ userId: string }>();

  const [state, action, pending] = useActionState(createNote, null);

  useEffect(() => {
    if (state?.status === "success") {
      toast("Note successfuly created");
    } else if (state?.status === "error") {
      toast("Something went wrong");
    }
  }, [state]);

  return (
    <section className="w-full h-full flex items-center justify-center flex-col gap-10">
      <h1>Create a New Note</h1>
      <form
        className="grid gap-6 min-w-[28rem] p-6 border border-neutral-300/70 shadow-xs bg-white rounded-3xl"
        action={action}
      >
        <div className="grid gap-2">
          <label>Title of your note</label>
          <Input
            type="text"
            placeholder="Fall quarter 2024"
            name="title"
            required
          />
        </div>
        <div className="grid gap-2">
          <label>Course Name</label>
          <Input placeholder="CSEN 146" name="tag" />
        </div>
        <div className="grid gap-2">
          <label>Upload Note</label>
          <Input
            type="file"
            placeholder="Title"
            name="pdf"
            accept="application/pdf"
            required
          />
        </div>
        <input hidden readOnly name="user_id" value={userId} />
        <Button type="submit" disabled={pending}>
          {pending ? <Loader className="animate-spin" /> : <PlusSquare />}
          {pending ? "Creating..." : "Create Note"}
        </Button>
      </form>
      <p className="text-neutral-400 text-sm text-center">
        All notes uploaded must follow community guidelines.
        <br />
        For details refer to the privacy policy.
      </p>
    </section>
  );
}
