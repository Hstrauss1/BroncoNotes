import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default async function DefaultPage() {
  return (
    <div className="p-6 flex flex-col items-center justify-center h-full gap-12">
      <hgroup className="flex flex-col items-center gap-2">
        <h1>Welcome to the Notes App</h1>
        <p>Please select a user to view their notes.</p>
      </hgroup>
      <form className="flex items-center gap-2 w-full max-w-md">
        <Input placeholder="Search notes..." />
        <Button>
          <Search />
          Search
        </Button>
      </form>
    </div>
  );
}
