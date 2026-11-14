import type React from "react";

export default function PetLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      data-theme="pet"
      className="min-h-full flex-1 flex flex-col bg-bg text-fg"
    >
      {children}
    </div>
  );
}
