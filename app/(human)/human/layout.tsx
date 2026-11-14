import type React from "react";

export default function HumanLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      data-theme="human"
      className="min-h-full flex-1 flex flex-col bg-bg text-fg"
    >
      {children}
    </div>
  );
}
