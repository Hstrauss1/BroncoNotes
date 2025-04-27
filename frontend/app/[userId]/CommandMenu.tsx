"use client";
import { useEffect } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../components/ui/command";
import { useCommandMenu } from "@/app/store";
import { useShallow } from "zustand/shallow";
import { ArrowRight, LogOut, PlusSquare, Search, Sidebar } from "lucide-react";

export function CommandMenu() {
  const { open, setOpen } = useCommandMenu(
    useShallow((state) => ({
      open: state.open,
      setOpen: state.setOpen,
    })),
  );

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(!open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search commands..." />
      <CommandEmpty>No results found.</CommandEmpty>
      <CommandList>
        <CommandGroup heading="Actions">
          <CommandItem>
            <PlusSquare />
            Create Note
          </CommandItem>
          <CommandItem>
            <Search />
            Search Note
          </CommandItem>
          <CommandItem>
            <Sidebar />
            Toggle Sidebar
          </CommandItem>
          <CommandItem>
            <LogOut />
            Log Out
          </CommandItem>
        </CommandGroup>
        <CommandGroup heading="Navigation">
          <CommandItem>
            <ArrowRight />
            My Notes
          </CommandItem>
          <CommandItem>
            <ArrowRight />
            Liked Notes
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
