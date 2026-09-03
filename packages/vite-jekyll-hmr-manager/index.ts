import type { Plugin, ViteDevServer } from "vite";
import path from "node:path";
import { createDialogClientSource } from "./src/dialog-client";

export interface ViteJekyllHmrManagerOptions {
  /** Verzeichnis für den Jekyll-Output. Standard: /var/www/html. */
  watchDir?: string;
  /** Nur Dateien mit diesen Endungen werden berücksichtigt. Standard: *.html. */
  extensions?: string[];
  /** Zur geänderten Seite wechseln, statt auf anderen Seiten einen Hinweis anzuzeigen. */
  navigateOnChange?: boolean;
  /** Ausführliche Ausgaben im Vite-Terminal und in der Browser-Konsole aktivieren. */
  debug?: boolean;
}

type PageChangedData = { url: string; file: string; sessionId: string };
const CLIENT_ID = "\0vite-jekyll-hmr-manager/client";

function pageUrl(relativeFile: string): string {
  const normalized = `/${relativeFile.split(path.sep).join("/")}`;
  if (normalized === "/index.html") return "/";
  if (normalized.endsWith("/index.html")) return normalized.slice(0, -"index.html".length);
  return normalized.replace(/\.html$/, "");
}

function isInside(file: string, directory: string): boolean {
  return file === directory || file.startsWith(directory + path.sep);
}

export function viteJekyllHmrManager(options: ViteJekyllHmrManagerOptions = {}): Plugin {
  const watchDir = path.resolve(options.watchDir ?? "/var/www/html");
  const extensions = options.extensions ?? [".html"];
  const navigateOnChange = options.navigateOnChange ?? false;
  const debug = options.debug ?? false;
  const sessionId = globalThis.crypto.randomUUID();
  const clientSource = () => createDialogClientSource(navigateOnChange, debug, sessionId);

  return {
    name: "vite-jekyll-hmr-manager",
    resolveId: (id) => id === CLIENT_ID ? CLIENT_ID : undefined,
    load: (id) => id === CLIENT_ID ? clientSource() : undefined,

    transformIndexHtml() {
      return [{ tag: "script", attrs: { type: "module" }, children: `import ${JSON.stringify(CLIENT_ID)};`, injectTo: "body" }];
    },

    configureServer(server: ViteDevServer) {
      server.middlewares.use("/@vite-jekyll-hmr-manager/client", async (_request, response) => {
        const transformed = await server.transformRequest(CLIENT_ID);
        response.statusCode = 200;
        response.setHeader("Content-Type", "application/javascript");
        response.end(transformed?.code ?? clientSource());
      });

      server.watcher.add(watchDir);
      server.watcher.on("all", (event, file) => {
        const absoluteFile = path.resolve(file);
        if (debug) console.log("[vite-jekyll-hmr-manager] watcher event", { event, file: absoluteFile });
        if (!isInside(absoluteFile, watchDir)) return;
        if (!["add", "change", "unlink"].includes(event)) return;

        const relativeFile = path.relative(watchDir, absoluteFile);
        // Nicht-HTML-Dateien dürfen den Seitenwechsel und den Dialog nicht auslösen.
        if (!relativeFile.endsWith(".html")) {
          if (debug) console.log("[vite-jekyll-hmr-manager] ignoring non-HTML change", { event, file: relativeFile });
          return;
        }
        if (!extensions.some((extension) => relativeFile.endsWith(extension))) return;

        const url = pageUrl(relativeFile);
        const data: PageChangedData = { url, file: relativeFile, sessionId };
        if (debug) console.log("[vite-jekyll-hmr-manager] sending page change", data);
        server.ws.send({ type: "custom", event: "vite-jekyll-hmr-manager:page-changed", data });
        server.ws.send({ type: "full-reload", path: `/${relativeFile.split(path.sep).join("/")}` });
      });
    },
  };
}

export default viteJekyllHmrManager;
