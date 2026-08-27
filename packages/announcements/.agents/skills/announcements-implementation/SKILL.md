---
name: announcements-implementation
description: Implement or extend @leuffen/announcements, including its data model, calendar scheduling, web components, vacation dialog, and legacy migration. Use for code changes to this package, not for writing announcement content.
---

# Announcements implementation

Keep changes to `@leuffen/announcements` compatible with practice websites and
with the existing `window.openhours` migration path.

## Package structure

- Keep `index.ts` in the package root as the public entrypoint. It should only
  re-export public APIs from `src/`.
- Put implementation files, declarations, and their colocated unit tests in
  `src/`.
- Keep test-only replacements for external packages in `test/`.
- Update `.ai-usage-info.md` and `README.md` when a public API or usage pattern
  changes. Prefer concrete examples in `.ai-usage-info.md`.

## Implementation rules

- Treat `startsOn` and `endsOn` as inclusive ISO calendar dates. Use
  `Temporal.PlainDate` through `AnnouncementSchedule`; do not introduce timestamp
  or local-midnight comparisons.
- Keep date selection and ordering in the DOM-independent schedule class. Web
  components should resolve data, call the schedule, and render the result.
- Preserve `AnnouncementData.version === 1` unless a versioned migration is part
  of the request.
- Keep `<leuffen-announcements>` safe for authored fallback markup. Render data
  values as text and retain the `data-owner` styling hooks.
- Open vacations through `LeuffenVacationDialog.show()`, which uses the
  programmatic Nextrap dialog component. Do not replace it with inline modal
  markup.
- Preserve the automatic `window.openhours` fallback for existing websites.
  New integrations should prefer the `data` property or a JSON script selected
  through `source`.

## Verification

Add or update focused tests for the behavior being changed. Date changes should
cover inclusive boundaries and relevant calendar edge cases. Dialog changes
should verify that one active vacation is opened only once. Run package lint,
typecheck, unit tests, and build before handing off.

Read `.ai-usage-info.md` for supported integration examples and `README.md` for
the current public data format.
