# Practice notices

## Ziel

Die Komponenten `liweco-news` und `liweco-vacation-modal` aus `@leuffen/liweco-base`
werden als gemeinsames Paket `@leuffen/practice-notices` übernommen. Das Paket richtet
sich vor allem an Arzt-Websites und zeigt allgemeine Hinweise sowie aktuelle
Urlaubsvertretungen an.

## Scope

- versioniertes, serialisierbares Datenformat für Hinweise und Urlaubsvertretungen
- reine, testbare Zeitraumlogik auf Basis von `Temporal.PlainDate`
- Legacy-Adapter für das bisherige `window.openhours`-Format
- `<leuffen-news>` für aktuelle und kommende Meldungen
- `<leuffen-vacation-modal>` als automatischer Controller für einen programmatischen
  `@nextrap/nte-dialog-component`-Dialog
- Unit-Tests für Zeitraumlogik, Legacy-Migration und Komponentensteuerung

## Non-Goals

- Öffnungszeitenberechnung aus der bisherigen `OfficeHours`-Klasse
- JSON-LD-Generierung oder Google-Business-Profile-Synchronisation
- ein eigenes visuelles Theme
- Netzwerkabruf der Daten innerhalb der Komponenten

## Öffentliche API

- `PracticeNoticeData`, `PracticeNotice`, `VacationNotice`, `ReplacementPractice`
- `NoticeSchedule`
- `fromLegacyOpenHours()`
- `LeuffenNews`, `LeuffenVacationModal`, `LeuffenVacationDialog`

Beide deklarativen Komponenten akzeptieren Daten über die Property `data`. Alternativ
kann `source="#id"` auf ein `<script type="application/json">` zeigen. Ohne explizite
Quelle wird aus Gründen der Rückwärtskompatibilität `window.openhours` gelesen.

## Daten und Datumssemantik

Datumswerte werden öffentlich als ISO-Strings `YYYY-MM-DD` gespeichert. Intern werden
sie als `Temporal.PlainDate` verglichen. `startsOn` und `endsOn` sind inklusive.
"Heute" wird anhand der konfigurierten IANA-Zeitzone ermittelt und kann für Tests
explizit übergeben werden.

## Abhängigkeiten

- `temporal-polyfill`, bis Temporal in allen Zielbrowsern verfügbar ist
- `lit`
- `@nextrap/nte-dialog-component` als Peer Dependency

`@nextrap/nte-dialog-component` ist im Nextrap-Monorepo vorhanden, aber zum Zeitpunkt
dieses Proposals noch nicht öffentlich auf npm veröffentlicht. Der Peer wird daher
vorübergehend als optional markiert, damit das Leuffen-Monorepo installierbar bleibt.
Vor der Veröffentlichung von `@leuffen/practice-notices` muss der Nextrap-Peer
veröffentlicht und die optionale Markierung entfernt werden.

## Akzeptanzkriterien

- bestehende Vacation-Daten lassen sich ohne inhaltlichen Umbau adaptieren
- Start- und Endtag eines Urlaubs werden korrekt als aktiv erkannt
- vergangene Meldungen werden nicht als News ausgegeben
- ein aktiver Urlaub öffnet genau einmal den programmatischen Dialog
- Inhalte werden nicht über ungesichertes `innerHTML` aus Metadaten gerendert
- Lint, Typecheck, Unit-Tests und Build des Monorepos laufen erfolgreich
