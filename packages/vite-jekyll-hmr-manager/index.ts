import type { Plugin, ViteDevServer } from "vite";
import { readdir, stat } from "node:fs/promises";
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

async function fileSize(file: string): Promise<number> {
  return (await stat(file)).size;
}

async function findHtmlFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) return findHtmlFiles(file);
    return entry.isFile() && entry.name.endsWith(".html") ? [file] : [];
  }));
  return files.flat();
}

export function viteJekyllHmrManager(options: ViteJekyllHmrManagerOptions = {}): Plugin {
  const watchDir = path.resolve(options.watchDir ?? "/var/www/html");
  const extensions = options.extensions ?? [".html"];
  const navigateOnChange = options.navigateOnChange ?? false;
  const debug = options.debug ?? false;
  const sessionId = globalThis.crypto.randomUUID();
  const clientSource = () => createDialogClientSource(navigateOnChange, debug, sessionId);
  const fileSizes = new Map<string, number>();
  const pendingChanges = new Map<string, ReturnType<typeof setTimeout>>();

  return {
    name: "vite-jekyll-hmr-manager",
    resolveId: (id) => id === CLIENT_ID ? CLIENT_ID : undefined,
    load: (id) => id === CLIENT_ID ? clientSource() : undefined,

    transformIndexHtml() {
      return [{ tag: "script", attrs: { type: "module" }, children: `import ${JSON.stringify(CLIENT_ID)};`, injectTo: "body" }];
    },

    async configureServer(server: ViteDevServer) {
      server.middlewares.use("/@vite-jekyll-hmr-manager/client", async (_request, response) => {
        const transformed = await server.transformRequest(CLIENT_ID);
        response.statusCode = 200;
        response.setHeader("Content-Type", "application/javascript");
        response.end(transformed?.code ?? clientSource());
      });

      try {
        const initialFiles = await findHtmlFiles(watchDir);
        await Promise.all(initialFiles.map(async (file) => {
          fileSizes.set(file, await fileSize(file));
        }));
        if (debug) console.log("[vite-jekyll-hmr-manager] initialized HTML fingerprints", { count: initialFiles.length });
      } catch (error) {
        if (debug) console.log("[vite-jekyll-hmr-manager] unable to initialize HTML fingerprints", { directory: watchDir, error });
      }

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

        const notifyPageChange = () => {
          const url = pageUrl(relativeFile);
          const data: PageChangedData = { url, file: relativeFile, sessionId };
          if (debug) console.log("[vite-jekyll-hmr-manager] sending page change", data);
          server.ws.send({ type: "custom", event: "vite-jekyll-hmr-manager:page-changed", data });
        };

        const previousTimer = pendingChanges.get(absoluteFile);
        if (previousTimer) clearTimeout(previousTimer);

        if (event === "unlink") {
          fileSizes.delete(absoluteFile);
          pendingChanges.delete(absoluteFile);
          notifyPageChange();
          return;
        }

        const timer = setTimeout(async () => {
          pendingChanges.delete(absoluteFile);
          try {
            const size = await fileSize(absoluteFile);
            if (fileSizes.get(absoluteFile) === size) {
              if (debug) console.log("[vite-jekyll-hmr-manager] ignoring unchanged file", { file: relativeFile, size });
              return;
            }
            fileSizes.set(absoluteFile, size);
            notifyPageChange();
          } catch (error) {
            if (debug) console.log("[vite-jekyll-hmr-manager] unable to fingerprint file", { file: relativeFile, error });
          }
        }, 50);
        pendingChanges.set(absoluteFile, timer);
      });
    },
  };
}

export default viteJekyllHmrManager;
