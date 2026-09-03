# Architektur: Vite Jekyll HMR Manager

## Zweck

Das Paket verbindet zwei Entwicklungsmechanismen:

1. Vite-HMR für importierte JavaScript-, TypeScript-, CSS- und SCSS-Module.
2. Seitenbezogene Reloads für HTML-Dateien, die Jekyll in ein Build-Verzeichnis schreibt.

Jekyll selbst muss dafür keinen LiveReload-Server starten. Es läuft mit `--watch` ohne `--incremental`, damit Änderungen an Includes und globalen Abhängigkeiten zuverlässig vollständig gebaut werden. Vite überwacht den Jekyll-Output und übernimmt die Kommunikation mit dem Browser.

## Aktueller Stand

**In Betrieb**

Die Website verwendet das Paket direkt:

```ts
import jekyllHmrManager from "@leuffen/vite-jekyll-hmr-manager";
```

Aktuelle Konfiguration:

```ts
jekyllHmrManager({
  watchDir: "/var/www/html",
  navigateOnChange: false,
  debug: true,
});
```

Das Paket ist als ESM-/CommonJS-Dual-Paket verfügbar und kann deshalb auch aus einer `vite.config.ts` geladen werden, die von Vite intern per CommonJS gebündelt wird.

## Ablauf einer Jekyll-Änderung

1. Jekyll erkennt eine Änderung und schreibt die betroffene HTML-Datei in `watchDir`.
2. Der Vite-Watcher empfängt ein `add`, `change` oder `unlink`-Ereignis.
3. Das Plugin prüft, ob die Datei innerhalb von `watchDir` liegt und eine überwachte Endung besitzt.
4. Bei `add`- und `change`-Events wartet das Plugin kurz, liest die Datei und vergleicht ihren SHA-256-Fingerprint mit dem zuletzt bekannten Stand. Unveränderte Dateien lösen keinen Reload aus.
5. Der Build-Pfad wird in eine Website-URL umgewandelt:

   ```text
   /var/www/html/leistungen/therapien.html
   → /leistungen/therapien
   ```

6. Vite sendet ein eigenes WebSocket-Event an die verbundenen Browser.
7. Zusätzlich sendet Vite einen Full-Reload mit dem HTML-Pfad. Vite lädt dadurch nur den Browser neu, dessen aktuelle URL zu diesem Pfad passt.
8. Andere geöffnete Seiten zeigen das Dialogfenster mit einem Link zur aktualisierten Seite.

## Dialog

Der Client-Code des Dialogs liegt getrennt vom Plugin-Kern in:

```text
src/dialog-client.ts
```

Das Modul wird vom Plugin als virtuelles Vite-Modul bereitgestellt. Im Jekyll-Proxy-Setup steht es zusätzlich unter folgendem Pfad zur Verfügung:

```text
/@vite-jekyll-hmr-manager/client
```

Das Dialogfenster wird als Webcomponent registriert:

```text
<vite-jekyll-hmr-dialog>
```

Es enthält einen Link zur geänderten Seite und folgende Aktionen:

- **Jetzt wechseln** – öffnet die geänderte Seite.
- **Später** – schließt den Dialog.
- **Automatisch zu aktualisierten Seiten wechseln** – speichert die Einstellung für den aktuellen Browser-Tab.
- **Nicht wieder anzeigen** – unterdrückt weitere Dialoge für den aktuellen Browser-Tab.

Die Einstellungen werden mit `sessionStorage` gespeichert und gelten nur für den jeweiligen Browser-Tab. Zusätzlich wird die Vite-Session-ID gespeichert. Bei einem Neustart von Vite ändert sie sich; dann werden die gespeicherten Vorauswahlen gelöscht und der Dialog erscheint wieder.

Der Dialog des Vite-Plugins muss immer eigenständig bleiben. HMR ist ausschließlich
für die Entwicklungsumgebung vorgesehen; der Dialog darf deshalb keine
Abhängigkeit von produktiven Website-Komponenten, Theme-Komponenten,
`@leuffen/announcements` oder anderen Laufzeitpaketen der Website erhalten.
So bleibt das Plugin unabhängig von der jeweiligen Website und kann in jeder
Vite-/Jekyll-Entwicklungsumgebung verwendet werden.

## Vite-HMR und Jekyll-Reload

Vite-HMR bleibt vollständig aktiv. Änderungen an importierten TS-, JS-, CSS- oder SCSS-Modulen werden direkt durch Vite verarbeitet.

Für Jekyll darf in der Vite-Proxy-Variante kein zweiter LiveReload-Server gestartet werden. In `/opt/package.json` läuft `jekyll-prox` daher ohne `--livereload`:

```text
jekyll serve ... --watch
```

Die Seitenaktualisierung des Jekyll-Outputs übernimmt ausschließlich das Plugin.

## Debugging

Mit folgender Option werden Logs aktiviert:

```ts
debug: true
```

Dann erscheinen im Vite-Terminal unter anderem:

```text
[vite-jekyll-hmr-manager] watcher event
[vite-jekyll-hmr-manager] sending page change
```

Im Browser werden empfangene Seitenänderungen protokolliert:

```text
[vite-jekyll-hmr-manager] change detected
```

Bei `debug: false` bleiben diese Ausgaben deaktiviert.

## Paketaufbau

```text
vite-jekyll-hmr-manager/
├── index.ts                 # Vite-Plugin und Watcher-Logik
├── src/
│   └── dialog-client.ts     # Browser-Webcomponent und HMR-Clientlogik
├── README.md
├── ARCHITECTURE.md
├── package.json
└── dist/
    ├── index.js             # ESM
    ├── index.cjs            # CommonJS
    └── index.d.ts           # TypeScript-Deklarationen
```

## Bekannte Einschränkung

Jekyll kann bei bestimmten Änderungen mehrere HTML-Dateien neu schreiben. In diesem Fall erhalten alle betroffenen anderen Seiten jeweils ein Änderungsereignis. Der Fingerprint-Vergleich verhindert Reloads für Dateien, deren Inhalt trotz eines Watcher-Events unverändert geblieben ist. Für zuverlässige Änderungen an globalen Layouts und Includes muss Jekyll ohne `--incremental` laufen.
