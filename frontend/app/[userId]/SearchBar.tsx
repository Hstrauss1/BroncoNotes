"use client";
import React, { useActionState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { extractCourseInfo, searchCourse } from "./action";

export default function SearchBar({
  token,
  className,
}: {
  token: string;
  className?: string;
}) {
  const [state, action, loading] = useActionState(
    async (_: unknown, formData: FormData) => {
      try {
        const query = formData.get("query") as string;
        if (!query || query.trim() === "") {
          throw new Error("Search query cannot be empty");
        }
        console.log("Search query:", query);
        const { course, number } = await extractCourseInfo(query);
        const r = await searchCourse(course, number, token);
        console.log("Search results:", r.data);

        return { status: "success", data: { query } };
      } catch (error) {
        return {
          status: "error",
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    },
    null
  );

  useEffect(() => {
    if (state?.status === "success") {
      console.log("Search completed successfully:");
    } else if (state?.status === "error") {
      console.error("Search failed:", state.error);
    }
  }, [state]);

  return (
    <form
      className={cn("flex items-center gap-2 w-full", className)}
      action={action}
    >
      <Input placeholder="Search notes..." name="query" />
      <Button type="submit" disabled={loading}>
        {loading ? <Loader className="animate-spin" /> : <Search />}
        Search
      </Button>
    </form>
  );
}
