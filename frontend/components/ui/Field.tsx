import React from "react";

export default function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-4">
      <label className="w-36 text-right pt-2">{label}</label>
      {children}
    </div>
  );
}
