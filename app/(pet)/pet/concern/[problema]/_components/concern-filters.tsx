"use client";

import { usePathname, useRouter } from "next/navigation";

export function ConcernFilters({
  formats,
  selectedFormat,
}: {
  formats: string[];
  selectedFormat: string;
}) {
  const pathname = usePathname();
  const router = useRouter();

  function selectFormat(format: string) {
    const query = new URLSearchParams(window.location.search);
    if (format) query.set("format", format);
    else query.delete("format");
    const search = query.toString();
    router.push(search ? `${pathname}?${search}` : pathname);
  }

  return (
    <fieldset className="flex flex-wrap items-end gap-4">
      <legend className="sr-only">Filters</legend>
      <label className="grid min-h-11 gap-1 text-sm font-bold text-fg">
        To be confirmed
        <select
          value={selectedFormat}
          onChange={(event) => selectFormat(event.target.value)}
          className="min-h-11 rounded-field border border-border bg-bg-elevated px-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <option value="">All</option>
          {formats.map((format) => (
            <option key={format} value={format}>
              {format}
            </option>
          ))}
          {!formats.length && (
            <option value="" disabled>
              To be confirmed
            </option>
          )}
        </select>
      </label>
      <label className="grid min-h-11 gap-1 text-sm font-bold text-fg">
        Sort
        <select
          value="featured"
          disabled
          className="min-h-11 rounded-field border border-border bg-bg-elevated px-3 text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <option value="featured">Recommended</option>
        </select>
      </label>
    </fieldset>
  );
}
