import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const CommentForm = ({ className }: { className?: string }) => {
  return (
    <form className={cn("w-full flex items-center gap-1.5", className)}>
      <Input placeholder="Add a review..." className="flex-1" />
      <Button type="submit">Send</Button>
    </form>
  );
};
