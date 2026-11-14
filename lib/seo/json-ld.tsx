import React from "react";

export interface JsonLdProps {
  data:
    Record<string, unknown> | Array<Record<string, unknown>> | null | undefined;
  id?: string;
}

export function JsonLd({ data, id }: JsonLdProps) {
  if (!data) {
    return null;
  }

  // Escape '<' to prevent script breakout / XSS inside application/ld+json
  const jsonString = JSON.stringify(data).replace(/</g, "\\u003c");

  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonString }}
    />
  );
}

export default JsonLd;
