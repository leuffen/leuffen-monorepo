# @leuffen/pagebuilder-connector

This package registers two Web Components: an invisible PageBuilder connector
and an edit button with an inline SVG pencil icon.

## Installation

```bash
npm install @leuffen/pagebuilder-connector
```

## Configuration and usage

Configure the connector before placing edit buttons:

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

The connector reads its attributes in `connectedCallback` and stores them in
the shared `pagebuilderConfig` object. Edit buttons read this configuration
only when clicked. At that moment the button constructs the edit URL and
navigates using `window.location.assign()`. No anchor or `href` is rendered.

### Connector attributes

| Attribute | Required | Description |
| --- | --- | --- |
| `base-url` | Yes | PageBuilder edit endpoint |
| `subscription-id` | Yes | Subscription identifier |
| `scope-id` | No | Scope identifier; empty or omitted skips `scope` |
| `file-name` | Yes | Target file relative to the site's content root |

The click navigation uses the query parameters `subscription`, `path`
(from `file-name`) and optionally `scope`. The filename is not inferred from
the current browser URL.

One connector configures all edit buttons on the page. If more than one
connector is connected, the most recently connected one replaces the shared
configuration. Attribute changes take effect after the connector is
reconnected to the DOM. Without required values, clicking has no effect.
Authorization must be enforced by the PageBuilder.
