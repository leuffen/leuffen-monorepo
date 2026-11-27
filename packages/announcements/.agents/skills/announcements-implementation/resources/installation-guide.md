# Installation guide for @leuffen/announcements

## Import

```ts
import '@leuffen/announcements';
```

## Input Data

Nutze das vorhandene Array `window.openhours.vacation` für alle Meldungen.
Das vollständige Format steht in
[openhours.schema.json](../../../../openhours.schema.json).

```html
<script>
  window.openhours = {
    _editor: 'openhours/v1',
    _status_values: ['Offen', 'Nach Vereinbarung'],
    table: [{ day: 'Montag', time: '08:00 – 12:00' }],
    json: [{ dayOfWeek: '1', from: '08:00', till: '12:00', status: 'Offen' }],
    vacation: [
      {
        type: 'vacation',
        from: '2026-12-24',
        till: '2026-12-31',
        title: '**Urlaub vom 24.12. bis 31.12.**',
        text: 'Bitte wenden Sie sich an unsere Vertretung.',
        popup: true,
        is_closed: true,
        variant: 'info',
      },
      {
        type: 'info',
        from: '',
        till: '',
        title: 'Geänderte Sprechzeiten',
        text: 'Bitte vereinbaren Sie einen Termin.',
        variant: 'warning',
      },
      {
        type: 'popup',
        from: '2026-12-01',
        till: '2026-12-07',
        title: 'Telefonische Erreichbarkeit',
        text: 'Bitte nutzen Sie unser Kontaktformular.',
        variant: 'danger',
      },
    ],
  };
</script>
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
