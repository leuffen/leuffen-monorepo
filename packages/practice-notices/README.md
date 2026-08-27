# @leuffen/practice-notices

News and vacation replacement notices for practice websites. The package contains the
`<leuffen-news>` and `<leuffen-vacation-modal>` web components plus a DOM-independent
`NoticeSchedule` API.

## Installation

```bash
npm install @leuffen/practice-notices @nextrap/nte-dialog-component
```

`@nextrap/nte-dialog-component` must be available in the consuming registry before this
package is published.

## Data format

```json
{
  "version": 1,
  "locale": "de-DE",
  "timeZone": "Europe/Berlin",
  "notices": [
    {
      "id": "summer-2026",
      "type": "vacation",
      "startsOn": "2026-08-03",
      "endsOn": "2026-08-14",
      "title": "Praxisurlaub",
      "summary": "Die Praxis bleibt geschlossen.",
      "content": "Ab dem 17. August sind wir wieder für Sie da.",
      "replacements": [
        {
          "name": "Praxis Dr. Beispiel",
          "phone": "+49 221 123456",
          "url": "https://example.org",
          "note": "Bitte vorher telefonisch anmelden."
        }
      ]
    }
  ]
}
```

`startsOn` and `endsOn` are inclusive ISO calendar dates.

## Declarative usage

```html
<script type="application/json" id="practice-notices">
  { "version": 1, "notices": [] }
</script>

<leuffen-news source="#practice-notices">Keine aktuellen Hinweise</leuffen-news>
<leuffen-vacation-modal source="#practice-notices"></leuffen-vacation-modal>
```

Applications can set `element.data` directly instead. If neither `data` nor `source` is
provided, both components adapt the legacy `window.openhours` object.

## Programmatic scheduling

```ts
import { NoticeSchedule } from '@leuffen/practice-notices';

const schedule = new NoticeSchedule(data);
const activeVacation = schedule.getActiveVacation('2026-08-10');
const upcoming = schedule.getUpcoming({ from: '2026-08-01', days: 30 });
```

## Migration

| Old | New |
|---|---|
| `<liweco-news>` | `<leuffen-news>` |
| `<liweco-vacation-modal>` | `<leuffen-vacation-modal>` |
| `window.openhours.vacation[].from` | `notices[].startsOn` |
| `window.openhours.vacation[].till` | `notices[].endsOn` |
| `short_text` | `summary` |
| `text` | `content` |

Use `fromLegacyOpenHours()` when migrating data explicitly. The automatic global
fallback is intended only for existing sites.
