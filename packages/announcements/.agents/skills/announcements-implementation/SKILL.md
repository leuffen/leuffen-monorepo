---
name: announcements-implementation
description: Integrate or adjust @leuffen/announcements, especially the components <leuffen-announcements> and <leuffen-vacation-modal>. Use this skill for usage, integration, and small package changes.
---

# @leuffen/announcements

Use this package when a site should:

- show upcoming vacation notices with `<leuffen-announcements>`
- open the current vacation note automatically with `<leuffen-vacation-modal>`

## Integration notes

- Provide data on `window.openhours`.
- The components read from `window.openhours` automatically.
- Keep authored fallback content inside `<leuffen-announcements>` if nothing is active/upcoming.
- Read `resources/installation-guide.md` only when import/setup examples are needed.
