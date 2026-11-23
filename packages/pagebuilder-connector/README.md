# @leuffen/pagebuilder-connector

This package provides two Web Components: a configuration-only connector
and an edit button with an inline SVG pencil icon.

## Installation

```bash
npm install @leuffen/pagebuilder-connector
```

## Configuration and usage

Configure the connector once and place edit buttons wherever needed:

```html
<leuffen-pagebuilder-connector
  base-url="https://pagebuilder.example.com/edit"
  subscription-id="site-123"
  scope-id=""
  file-name="pages/home.md"
></leuffen-pagebuilder-connector>

<leuffen-pagebuilder-edit-button></leuffen-pagebuilder-edit-button>

<script type="module">
  import '@leuffen/pagebuilder-connector';
</script>
```

The connector is not visible. Clicking the edit icon opens the PageBuilder
using the connector's configuration. With this example, the URL contains
`subscription=site-123` and `path=pages%2Fhome.md`. The optional
`scope` parameter is omitted because `scope-id` is empty.

### Connector attributes

| Attribute | Required | Description |
| --- | --- | --- |
| `base-url` | Yes | PageBuilder edit endpoint |
| `subscription-id` | Yes | Subscription identifier |
| `scope-id` | No | Scope identifier; empty or omitted skips `scope` |
| `file-name` | Yes | Target file relative to the site's content root |

The filename is passed as the `path` URL parameter; it is not inferred from
the current browser URL. The edit button has no configuration attributes.
It reads the nearest enclosing connector, if present, otherwise the first
connector in the document.

A connector can also enclose its buttons:

```html
<leuffen-pagebuilder-connector
  base-url="https://pagebuilder.example.com/edit"
  subscription-id="site-123"
  file-name="pages/contact.md"
>
  <leuffen-pagebuilder-edit-button></leuffen-pagebuilder-edit-button>
</leuffen-pagebuilder-connector>
```

The edit link is refreshed when clicked. If no connector is available or
required values are missing, the button remains visible without a link.
Authorization must be enforced by the PageBuilder, not by the button.
