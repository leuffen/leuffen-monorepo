# @leuffen/vite-jekyll-hmr-manager

Vite-Plugin für Jekyll-Entwicklungsumgebungen. Das Paket verbindet Vite-HMR für JavaScript, TypeScript, CSS und SCSS mit dem von Jekyll erzeugten HTML-Output.

## Funktionen

- Vite-HMR bleibt für importierte JavaScript-, TypeScript-, CSS- und SCSS-Module aktiv.
- Das konfigurierte `watchDir` wird auf Änderungen überwacht.
- Bei einer Änderung an einer erzeugten HTML-Datei wird nur die zugehörige aktuell geöffnete Seite neu geladen.
- Andere geöffnete Seiten werden nicht neu geladen. Sie erhalten ein kleines Dialogfenster mit einem Link zur aktualisierten Seite.
- Das Dialogfenster bietet:
  - **Jetzt wechseln**
  - **Später**
  - **Automatisch zu aktualisierten Seiten wechseln**
  - **Nicht wieder anzeigen**
- Die beiden persönlichen Einstellungen werden im `sessionStorage` des aktuellen Browser-Tabs gespeichert.
- Bei jedem Vite-Neustart wird eine neue Session-ID erzeugt. Dadurch werden die gespeicherten Vorauswahlen verworfen und der Dialog erscheint wieder.
- Mit `navigateOnChange: true` kann das Dialogfenster vollständig übersprungen werden.
- Mit `debug: true` werden Watcher- und Seitenänderungen im Vite-Terminal sowie in der Browser-Konsole protokolliert.

## Einbindung

```ts
// Vite-Konfiguration
import { defineConfig } from "vite";
import jekyllHmrManager from "@leuffen/vite-jekyll-hmr-manager";

export default defineConfig({
  plugins: [
    jekyllHmrManager({
      watchDir: "/var/www/html",
      navigateOnChange: false,
      debug: true,
    }),
  ],
  server: {
    hmr: true,
  },
});
```

Das Paket kann direkt aus npm oder über einen Workspace installiert werden:

```bash
npm install -D @leuffen/vite-jekyll-hmr-manager
```

## Jekyll-Proxy-Setup

Wenn die HTML-Seiten von einem separaten Jekyll-Server über Vite proxied werden, kann Vite `transformIndexHtml` nicht auf die Jekyll-Antwort anwenden. In diesem Fall müssen im Jekyll-Layout beide Vite-Module eingebunden werden:

```html
<script src="/@vite/client" type="module"></script>
<script src="/@vite-jekyll-hmr-manager/client" type="module"></script>
```

Der Jekyll-Proxy sollte keinen eigenen LiveReload-Server starten. Für die Proxy-Variante genügt:

```bash
jekyll serve --watch --incremental
```

Das Paket überwacht den Jekyll-Output selbst.

## Optionen

### `watchDir`

```ts
watchDir?: string
```

Verzeichnis, in dem Jekyll die erzeugten Dateien ablegt. Standard:

```text
/var/www/html
```

### `extensions`

```ts
extensions?: string[]
```

Dateiendungen, die eine Seitenänderung auslösen. Standard:

```ts
[".html"]
```

### `navigateOnChange`

```ts
navigateOnChange?: boolean
```

Wenn `true`, wird bei einer Änderung an einer anderen Seite direkt zu dieser Seite navigiert. Wenn `false`, erscheint das Dialogfenster. Standard ist `false`.

### `debug`

```ts
debug?: boolean
```

Aktiviert ausführliche Logs im Vite-Terminal und in der Browser-Konsole. Standard ist `false`.

Die Session-ID wird intern bei jedem Vite-Neustart neu erzeugt und muss nicht konfiguriert werden.

Beispiel für eine Debug-Ausgabe:

```text
[vite-jekyll-hmr-manager] watcher event
[vite-jekyll-hmr-manager] sending page change
[vite-jekyll-hmr-manager] change detected
```

## Verhalten bei Änderungen

| Änderung | Verhalten |
|---|---|
| Importierte TS-/JS-Datei | Vite-HMR |
| Importierte CSS-/SCSS-Datei | Vite-HMR |
| Erzeugte HTML-Datei der aktuellen Seite | Reload der aktuellen Seite |
| Erzeugte HTML-Datei einer anderen Seite | Dialog mit Link |
| Andere Datei im Jekyll-Output | Keine Seitenänderung |

## Paket bauen

Das Paket wird als ESM-/CommonJS-Dual-Paket gebaut:

```bash
npm run build
```

Dabei entstehen:

```text
dist/index.js
dist/index.cjs
dist/index.d.ts
```
