import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const walk = async (dir) =>
  (
    await Promise.all(
      (await readdir(dir, { withFileTypes: true })).map((entry) =>
        entry.isDirectory()
          ? walk(path.join(dir, entry.name))
          : path.join(dir, entry.name)
      )
    )
  ).flat();
const sourceFiles = async (dir) =>
  (await walk(path.join(root, dir))).filter((file) => /\.[jt]sx?$/.test(file));
const routePath = (file) =>
  `/${path
    .relative(path.join(root, "app"), path.dirname(file))
    .split(path.sep)
    .filter((part) => !/^\(.+\)$/.test(part))
    .join("/")}`
    .replace(/\/page$/, "")
    .replace(/\/$/, "") || "/";
const pages = (await sourceFiles("app")).filter(
  (file) =>
    path.basename(file) === "page.tsx" &&
    !/(^|\/)(dev|pipeline|api)(\/|$)/.test(
      path.relative(path.join(root, "app"), file)
    )
);
const components = [
  ...(await sourceFiles("app")),
  ...(await sourceFiles("components")),
].filter((file) => file.endsWith(".tsx"));
const routes = pages.map(routePath);
const metadata = [];
const links = [];
const jsonLd = [];

for (const file of new Set([...pages, ...components])) {
  const source = await readFile(file, "utf8");
  const rel = path.relative(root, file);
  if (pages.includes(file)) {
    const exportAt = source.search(
      /export\s+(?:const\s+metadata\b|(?:async\s+)?function\s+generateMetadata\b)/
    );
    const block = exportAt < 0 ? "" : source.slice(exportAt, exportAt + 5000);
    if (
      exportAt < 0 ||
      !/\btitle\s*:/.test(block) ||
      !/\bdescription\s*:/.test(block)
    )
      metadata.push({ file: rel, route: routePath(file) });
  }
  for (const tag of source.matchAll(/<(?:Link|a)\b[^>]*>/gs)) {
    const hrefs = tag[0].matchAll(
      /\bhref\s*=\s*(?:\{\s*)?["'](\/[^"'#?]*)["']/g
    );
    for (const match of hrefs) {
      const href = match[1].replace(/\/$/, "") || "/";
      const exists = routes.some(
        (route) =>
          route === href ||
          (route.split("/").length === href.split("/").length &&
            route
              .split("/")
              .every(
                (segment, i) =>
                  segment.startsWith("[") || segment === href.split("/")[i]
              ))
      );
      if (!exists) links.push({ file: rel, href });
    }
  }
  for (const match of source.matchAll(
    /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
  )) {
    try {
      const data = JSON.parse(match[1].trim());
      const items = Array.isArray(data) ? data : [data];
      if (items.some((item) => !item?.["@context"] || !item?.["@type"]))
        jsonLd.push({ file: rel, error: "@context/@type ausente" });
    } catch (error) {
      jsonLd.push({ file: rel, error: `JSON inválido: ${error.message}` });
    }
  }
}

export { jsonLd, links, metadata, routes };

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  console.log(
    JSON.stringify({ routes: routes.length, metadata, links, jsonLd }, null, 2)
  );
  if (metadata.length || links.length || jsonLd.length) process.exitCode = 1;
}
