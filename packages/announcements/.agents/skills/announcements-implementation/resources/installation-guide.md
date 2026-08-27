# Installation guide for @leuffen/announcements

## Import the package

```ts
import '@leuffen/announcements';
```

## Provide input data

```html
<script>
  window.openhours = {
    vacation: [
      {
        title: '## Urlaub vom 01.09. bis 12.09.',
        text: 'Unsere Praxis ist geschlossen. Vertretung übernimmt **Praxis Mustermann**.',
        from: '2026-09-01',
        till: '2026-09-12'
      }
    ]
  };
</script>
```

## Component examples

### Upcoming announcement ribbon/text

```html
<leuffen-announcements data-class="style-ribbon text-light">
  Aktuell keine Hinweise.
</leuffen-announcements>
```

### Auto-opening vacation modal

```html
<leuffen-vacation-modal></leuffen-vacation-modal>
```

### Typical combined usage

```html
<script type="module">
  import '@leuffen/announcements';
</script>

<script>
  window.openhours = {
    vacation: [
      {
        title: '## Urlaub vom 01.09. bis 12.09.',
        text: 'Unsere Praxis ist geschlossen. Vertretung übernimmt **Praxis Mustermann**.',
        from: '2026-09-01',
        till: '2026-09-12'
      }
    ]
  };
</script>

<leuffen-announcements data-class="style-ribbon">
  Aktuell keine Hinweise.
</leuffen-announcements>

<leuffen-vacation-modal></leuffen-vacation-modal>
```
