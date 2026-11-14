// @ts-expect-error jsdom types are not in local devDependencies
import { JSDOM } from "jsdom";

const dom = new JSDOM("<!doctype html><html><body></body></html>", {
  url: "http://localhost",
});

Object.defineProperty(globalThis, "window", {
  value: dom.window,
  writable: true,
  configurable: true,
});
Object.defineProperty(globalThis, "self", {
  value: dom.window,
  writable: true,
  configurable: true,
});
Object.defineProperty(globalThis, "document", {
  value: dom.window.document,
  writable: true,
  configurable: true,
});
Object.defineProperty(globalThis, "navigator", {
  value: dom.window.navigator,
  writable: true,
  configurable: true,
});
Object.defineProperty(globalThis, "HTMLElement", {
  value: dom.window.HTMLElement,
  writable: true,
  configurable: true,
});
Object.defineProperty(globalThis, "HTMLAnchorElement", {
  value: dom.window.HTMLAnchorElement,
  writable: true,
  configurable: true,
});

export { dom };
