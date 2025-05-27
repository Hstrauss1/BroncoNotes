"use client";

import { Note } from "@/app/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader, Trash } from "lucide-react";
import React, { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { deleteNote } from "./action";

export default function SettingsForm({
  note,
  token,
}: {
  note: Note;
  token: string;
}) {
  const [deleteState, deleteNoteAction, deletePending] = useActionState(
    async () => {
      try {
        await deleteNote(note.note_id, token);
        return { status: "success" };
      } catch (error) {
        return {
          status: "error",
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    },
    undefined
  );

  useEffect(() => {
    if (deleteState?.status === "success") {
      toast.success("Note deleted successfully!");
    } else if (deleteState?.status === "error") {
      toast.error("Failed to delete note. Please try again.");
    }
  }, [deleteState]);

  return (
    <div>
      <form className="grid gap-6">
        <div className="grid gap-3">
          <div className="flex items-center gap-4">
            <label htmlFor="title" className="w-36 text-right">
              Title
            </label>
            <Input type="text" id="title" defaultValue={note.title} />
          </div>
          <div className="flex items-center gap-4">
            <label htmlFor="title" className="w-36 text-right">
              Tag
            </label>
            <Input type="text" id="title" defaultValue={note.title} />
          </div>
        </div>
        <Button type="submit" variant="secondary" size="sm">
          Save Changes
        </Button>
      </form>
      <hr />
      <form className="grid gap-6" action={deleteNoteAction}>
        <input type="hidden" name="noteId" value={note.note_id} />
        <Button
          type="submit"
          variant="secondary"
          size="sm"
          disabled={deletePending}
        >
          {deletePending ? <Loader className="animate-spin" /> : <Trash />}
          {deletePending ? "Deleting..." : "Delete Note"}
        </Button>
      </form>
    </div>
  );
}
