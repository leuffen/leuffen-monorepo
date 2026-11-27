# Installation guide for @leuffen/announcements

## Import

```ts
import '@leuffen/announcements';
```

## Input Data

Pflege die Öffnungszeiten und alle drei Meldungstypen ausschließlich in
`_data/openhours.yml`. Verwende als Vorlage
[openhours.example.yml](../../../../openhours.example.yml); das verbindliche
Datenformat steht in [openhours.schema.json](../../../../openhours.schema.json).

Ergänze die folgende Zeile im bereits vorhandenen `<script>`-Tag in
`docs/_layouts/10_blanc.html`, vor der Initialisierung der Komponenten. Wie im
[ThemeJS2-Basislayout](https://github.com/leuffen/themejs2/blob/main/docs/_layouts/10_blanc.html)
serialisiert der Liquid-Filter `jsonify` die vollständigen YAML-Daten beim
Jekyll-Build direkt nach `window.openhours`. Kein manuell gepflegtes
JavaScript-Datenobjekt und keine separate JSON-Datei anlegen.

```liquid
window.openhours = {{ site.data.openhours | jsonify }};
```

## Seitenbereiche

```html
<!-- Alle Meldungen an einer Stelle -->
<leuffen-announcements>Keine aktuellen Hinweise</leuffen-announcements>

<!-- Urlaubsankündigungen im Header -->
<leuffen-announcements type="vacation" data-class="style-ribbon">
</leuffen-announcements>

<!-- Hinweise im Seiteninhalt -->
<leuffen-announcements type="info" data-class="practice-notices">
</leuffen-announcements>

<!-- Optional: Popup-Meldungen zusätzlich im Seiteninhalt -->
<leuffen-announcements type="popup"></leuffen-announcements>

<!-- Automatisches Popup einmal pro Seite -->
<leuffen-vacation-modal></leuffen-vacation-modal>
```

Die Beispiele sind unabhängige Platzierungen; kombiniere nur die Bereiche,
die auf der Website benötigt werden. Die ungefilterte Liste kann alternativ
zu getrennten Bereichen genutzt werden. Der Popup-Controller wird einmal
pro Seite eingebunden.

Jede Meldung erhält ein eigenes DIV mit `announcement-<type>` und
`announcement-variant-<variant>` (danger, warning, info, success);
`data-class` bleibt die Containerklasse. Urlaub zeigt nur den Titel,
auch im Voraus; Hinweise und Popup-Meldungen zeigen Titel und Text im
aktiven Zeitraum. Leere Datumsgrenzen sind unbegrenzt. `popup: true`
aktiviert bei Urlaub den Dialog, `is_closed: true` die Schließung.
Der Typ `popup` öffnet unabhängig vom gleichnamigen Flag einen Dialog.

Ältere Urlaubseinträge ohne Typ bleiben kompatibel. Weitere CSS-Hooks und
Beispiele stehen in [README.md](../../../../README.md).
