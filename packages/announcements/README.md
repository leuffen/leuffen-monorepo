# @leuffen/announcements

Das Package registriert `<leuffen-announcements>` und
`<leuffen-vacation-modal>` und exportiert `OfficeHours`. Die Daten kommen
weiterhin aus `window.openhours` (beispielsweise aus `_data/openhours.yml`).
Das vollständige aktuelle Dateiformat steht in
[openhours.schema.json](openhours.schema.json).

## Installation

```bash
npm install @leuffen/announcements @nextrap/nte-dialog-component
```

```ts
import '@leuffen/announcements';
```

## Input Data

Pflege alle Daten in `_data/openhours.yml`, entsprechend dem kommentierten
[openhours.example.yml](openhours.example.yml) und dem
[openhours.schema.json](openhours.schema.json). Alle drei Meldungstypen stehen
im bestehenden Array `vacation`.

Serialisiere die vollständigen Daten wie im
[ThemeJS2-Basislayout](https://github.com/leuffen/themejs2/blob/main/docs/_layouts/10_blanc.html)
mit der folgenden Zeile im vorhandenen `<script>`-Tag von
`docs/_layouts/10_blanc.html`, vor der Initialisierung der Komponenten.
`jsonify` erzeugt das JSON beim Build direkt aus `site.data.openhours`;
die Daten werden nicht zusätzlich im JavaScript gepflegt.

```liquid
window.openhours = {{ site.data.openhours | jsonify }};
```

## Verwendung in verschiedenen Seitenbereichen

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

Ohne `type` zeigt die Liste alle relevanten Meldungstypen an. Mit
`type="vacation"`, `type="info"` oder `type="popup"` erscheinen nur
Meldungen dieses Typs. Mehrere Instanzen können dieselbe Datenquelle nutzen.
Die Fallback-Inhalte bleiben erhalten, wenn keine passende Meldung vorliegt.

| Typ | Anzeige in der Liste | Automatisches Popup |
| --- | --- | --- |
| `vacation` | Titel, auch vor dem Beginn | Bei `popup: true` im aktiven Zeitraum |
| `info` | Titel und Text im aktiven Zeitraum | Nein |
| `popup` | Titel und Text im aktiven Zeitraum | Im aktiven Zeitraum |

Leere Datumsgrenzen bedeuten keine zeitliche Begrenzung. `till` wird wie
bisher bis zum Ende des Tages berücksichtigt. Nur Urlaub mit `is_closed:
true` markiert die Praxis als geschlossen; der erste aktive Popup-Eintrag
wird wie bisher über den programmgesteuerten Dialog geöffnet.

## CSS-Klassen

`data-class` bleibt die Klasse des generierten Listencontainers. Jede
Meldung ist ein eigenes `div[data-owner="leuffen-announcement"]` mit
`announcement`, `announcement-vacation`, `announcement-info` oder
`announcement-popup` und der Variantenklasse
`announcement-variant-danger`, `announcement-variant-warning`,
`announcement-variant-info` oder `announcement-variant-success`.
Urlaub mit aktiviertem Popup erhält zusätzlich `has-popup`, bei
Schließung zusätzlich `is-closed`. Titel und Text haben die Klassen
`announcement-title` bzw. `announcement-text`.

```css
leuffen-announcements.no-announcements {
  display: none;
}

.practice-notices {
  display: grid;
  gap: 1rem;
}

.announcement-variant-warning {
  border-inline-start: 4px solid currentColor;
  padding-inline-start: 1rem;
}
```

## OfficeHours

```ts
import { OfficeHours } from '@leuffen/announcements';

const officeHours = new OfficeHours();
if (window.openhours) {
  officeHours.loadStruct(window.openhours);
  const notices = officeHours.getAnnouncements('info');
  const upcomingVacations = officeHours.getUpcomingVacation(null);
  const activePopup = officeHours.getActivePopup();
}
```

## Kompatibilität

Alte Einträge ohne `type` bleiben Urlaubsmeldungen; fehlen dort `popup`
und `is_closed`, gilt wie bisher jeweils `true`. Bei einem expliziten
`type: 'vacation'` gilt für fehlendes `is_closed` der neue Standardwert
`false`. `short_text` bleibt zulässig, wird jedoch nicht angezeigt.
Strukturierte Zeiten unterstützen weiterhin `to`, englische Wochentage
und den Status `open`; neue Daten nutzen `till`, numerische Wochentage
(auch als String) und beispielsweise `Offen`. Andere Statuswerte werden
nicht automatisch als geöffnet interpretiert. Die vorhandenen
`getVacation`- und `getUpcomingVacation`-Methoden liefern weiterhin
Urlaubsdaten; `isOpen` berücksichtigt die Schließungsoption.

| Alt | Neu |
| --- | --- |
| `<liweco-news>` | `<leuffen-announcements>` |
| `<liweco-vacation-modal>` | `<leuffen-vacation-modal>` |
| `window.openhours` | `window.openhours` |
| `OfficeHours` | `OfficeHours` |
