# @leuffen/announcements

The package carries the vacation announcement behavior from
`@leuffen/liweco-base` into the Leuffen monorepo. It registers
`<leuffen-announcements>` and `<leuffen-vacation-modal>` and exports the original
`OfficeHours` business logic.

The component names and the modal implementation changed. The data source and
date behavior did not: both components read `window.openhours`, and vacation
ranges are evaluated with JavaScript `Date` exactly as in the old package.

## Installation

```bash
npm install @leuffen/announcements @nextrap/nte-dialog-component
```

`@nextrap/nte-dialog-component` must be available in the consuming registry
before this package is published.

## Data source

Define the existing `window.openhours` object before the components initialize.
No new data format is required.

```html
<script>
  window.openhours = {
    _editor: 'openhours',
    table: [],
    _status_values: [],
    json: [],
    vacation: [
      {
        from: '2026-08-03',
        till: '2026-08-14',
        title: '**Praxisurlaub**',
        short_text: 'Unsere Praxis bleibt geschlossen.',
        text: 'Ab dem 17. August sind wir wieder für Sie da.',
      },
    ],
  };
</script>

<leuffen-announcements>Keine aktuellen Hinweise</leuffen-announcements>
<leuffen-vacation-modal></leuffen-vacation-modal>

<script type="module">
  import '@leuffen/announcements';
</script>
```

`<leuffen-announcements>` lists current and future vacations. The authored
content is restored when there is no upcoming vacation. `data-class` is copied
to the generated list container.

`<leuffen-vacation-modal>` opens the first active vacation with the programmatic
Nextrap dialog component. Titles and body text keep the small Markdown conversion
from the old package (`***bold italic***`, `**bold**`, `*italic*`, and `---`).

## OfficeHours

```ts
import { OfficeHours } from '@leuffen/announcements';

const officeHours = new OfficeHours();
officeHours.loadStruct(window.openhours);

const activeVacation = officeHours.getVacation(null);
const upcomingVacations = officeHours.getUpcomingVacation(null);
```

`OfficeHours` uses the original JavaScript `Date` comparisons. `till` is set to
23:59:59.999 in local time, and passing `null` uses the current date.

## Migration

| Old                       | New                        |
| ------------------------- | -------------------------- |
| `<liweco-news>`           | `<leuffen-announcements>`  |
| `<liweco-vacation-modal>` | `<leuffen-vacation-modal>` |
| `window.openhours`        | `window.openhours`         |
| `OfficeHours`             | `OfficeHours`              |

Existing `from`, `till`, `title`, `short_text`, and `text` vacation fields stay
unchanged.
