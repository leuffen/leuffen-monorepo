# @leuffen/pagebuilder-connector

The package registers the `<leuffen-pagebuilder-edit>` Web Component.
It displays an edit icon as an inline SVG and links to the PageBuilder for the
current page. No additional UI framework is required.

## Installation

```bash
npm install @leuffen/pagebuilder-connector
```

## Configuration

Set the PageBuilder base URL with `base-path` and provide the subscription ID
through `window['micx-subscription']` before the element initializes:

```html
<script>
  window['micx-subscription'] = { subscriptionId: 'site-123' };
</script>

<leuffen-pagebuilder-edit
  base-path="https://pagebuilder.example.com/edit"
></leuffen-pagebuilder-edit>

<script type="module">
  import '@leuffen/pagebuilder-connector';
</script>
```

For the example, the link points to the configured URL with the query
parameters `subscription=site-123` and `path=<current pathname>`. The path
comes from `window.location.pathname`.

### Configuration options

| Source | Option | Purpose |
| --- | --- | --- |
| Element attribute | `base-path` | PageBuilder edit URL (required unless supplied globally) |
| Element attribute | `subscription-id` | Overrides the global subscription ID |
| `window['micx-subscription']` | `subscriptionId` or `id` | Subscription ID |
| `window['micx-subscription']` | `pagebuilderBasePath` or `basePath` | Optional base URL |

The subscription global may also be a string containing the ID. For
compatibility, the component also accepts `window['mix-subscription']` or
`window.micxSubscription`.

To configure everything directly on the component instead, replace the
global configuration and element above with:

```html
<leuffen-pagebuilder-edit
  subscription-id="site-456"
  base-path="https://pagebuilder.example.com/edit"
></leuffen-pagebuilder-edit>
```

The icon link is refreshed when clicked or when configuration attributes
change. If the ID or base path is unavailable, the icon remains visible
without a navigation target. The consuming website must enforce authorization
for the PageBuilder separately.

The query parameter names `subscription` and `path` are the connector's
current URL convention and must match the PageBuilder frontend.
