# Announcements

## Ziel

Die Komponenten `liweco-news` und `liweco-vacation-modal` aus
`@leuffen/liweco-base` werden als gemeinsames Paket `@leuffen/announcements`
übernommen. Datenquelle und Business-Logik bleiben kompatibel zum alten Paket.

## Scope

- unveränderte `window.openhours`-Datenstruktur
- übernommene `OfficeHours`-Logik auf Basis von JavaScript `Date`
- `<leuffen-announcements>` als umbenannte Variante von `<liweco-news>`
- `<leuffen-vacation-modal>` als automatischer Controller für einen
  programmatischen `@nextrap/nte-dialog-component`-Dialog
- übernommene Markdown-Konvertierung für Titel und Urlaubstext
- Unit-Tests für Zeitraumlogik und Komponentensteuerung

## Bewusste Abweichungen vom alten Paket

- Die Custom-Element-Namen verwenden `leuffen` und `announcements`.
- Das Vacation Modal erzeugt kein eigenes Bootstrap-Modal-Markup, sondern öffnet
  die programmatische Nextrap-Dialogkomponente.
- Styling-Hooks verwenden die neuen Komponentennamen.

## Öffentliche API

- `LeuOpenHours`, `LeuOpenHour`, `LeuVacation`
- `OfficeHours`, `OpenHour`, `Vacation`, `TimeInterval`
- `LeuffenAnnouncements`, `LeuffenVacationModal`, `LeuffenVacationDialog`

Beide deklarativen Komponenten lesen ausschließlich `window.openhours`. Die
Felder `from`, `till`, `title`, `short_text` und `text` werden nicht umbenannt.

## Datumsverhalten

Das Verhalten entspricht `@leuffen/liweco-base`:

- Strings werden mit `new Date(value)` konvertiert.
- Das Ende eines Urlaubs wird auf lokale 23:59:59.999 gesetzt.
- `null` verwendet das aktuelle Datum.
- `getUpcomingVacation(null)` liefert alle noch nicht beendeten Urlaube.
- Begrenzte Intervalle verwenden die drei bisherigen Überlappungsprüfungen.

## Abhängigkeiten

- `lit`
- `@nextrap/nte-dialog-component` als Peer Dependency

`@nextrap/nte-dialog-component` ist im Nextrap-Monorepo vorhanden, aber zum
Zeitpunkt dieses Proposals noch nicht öffentlich auf npm veröffentlicht. Der Peer
wird daher vorübergehend als optional markiert. Vor der Veröffentlichung von
`@leuffen/announcements` muss der Peer veröffentlicht und die optionale Markierung
entfernt werden.

## Akzeptanzkriterien

- bestehende `window.openhours`-Daten funktionieren ohne Migration
- Start- und Endtag eines Urlaubs werden wie im alten Paket erkannt
- vergangene Urlaube werden nicht als Announcement ausgegeben
- ein aktiver Urlaub öffnet den programmatischen Dialog
- Markdown in Titel und Text wird wie bisher umgewandelt
- Lint, Typecheck, Unit-Tests und Build des Pakets laufen erfolgreich
