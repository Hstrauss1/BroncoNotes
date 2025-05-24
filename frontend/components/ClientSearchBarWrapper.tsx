"use client";
import { useSession, SessionProvider } from "next-auth/react";
import React from "react";
import SearchBar from "@/components/SearchBar";

export function ClientSearchBarWrapper() {
  return (
    <SessionProvider>
      <InnerClientSearchBarWrapper />
    </SessionProvider>
  );
}

function InnerClientSearchBarWrapper() {
  const { data: session } = useSession();
  if (!session) return null;
  return <SearchBar />;
}
