---
name: announcements-implementation
description: Implement or extend @leuffen/announcements while preserving the liweco-base OfficeHours, window.openhours, announcement list, and vacation modal behavior. Use for code changes to this package, not for writing announcement content.
---

# Announcements implementation

Keep `@leuffen/announcements` behavior compatible with the original
`@leuffen/liweco-base` components. The renamed elements and the programmatic
Nextrap dialog are the intended differences.

## Package structure

- Keep `index.ts` in the package root as an export-only public entrypoint.
- Put implementation files, declarations, and colocated tests in `src/`.
- Keep test-only replacements for external packages in `test/`.
- Update `.ai-usage-info.md` and `README.md` when public behavior changes.

## Compatibility rules

- Read `window.openhours` directly. Do not introduce another component data
  property, source selector, or data schema unless the user explicitly requests
  a separate follow-up migration.
- Preserve `OfficeHours` date behavior: use `new Date(value)`, set `till` to local
  23:59:59.999, treat `null` as now, and retain the original interval overlap
  checks.
- Keep `OfficeHours` responsible for loading opening hours and vacations. The web
  components should call it rather than duplicate date comparisons.
- Preserve the DOM-ready wait and 100 ms startup delay used by the old
  components.
- Keep the original small Markdown conversion for vacation titles and body text.
- `<leuffen-announcements>` replaces `<liweco-news>` but retains its upcoming
  vacation and authored-fallback behavior.
- `<leuffen-vacation-modal>` must open an active vacation through
  `LeuffenVacationDialog.show()`. Do not reintroduce inline modal markup.

## Verification

Compare business-logic changes against `@leuffen/liweco-base` before altering
behavior. Cover inclusive vacation end dates, current and future filtering,
interval overlaps, authored fallback content, and active modal opening. Run
package lint, typecheck, unit tests, and build before handing off.

Read `.ai-usage-info.md` for integration examples and `README.md` for the public
API and unchanged `window.openhours` fields.
