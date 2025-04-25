"use client";
import { PlusSquare } from "lucide-react";
import { useCommandMenu } from "../store";
import { SidebarMenuButton } from "@/components/ui/sidebar";

export const NewNote = () => {
  const setOpen = useCommandMenu((state) => state.setOpen);
  return (
    <SidebarMenuButton
      onClick={() => setOpen(true)}
      className="relative group/newnote"
    >
      <PlusSquare />
      New Note
      <kbd className="*:bg-neutral-200 *:size-5 *:rounded-sm *:flex *:items-center *:justify-center *:leading-3 flex items-center gap-0.5 h-fit font-normal absolute right-2 top-1.5 transition-opacity opacity-100 group-hover/newnote:opacity-0">
        <span className="text-base mt-[0.5px]">⌘</span>
        <span className="text-xs">K</span>
      </kbd>
    </SidebarMenuButton>
  );
};
