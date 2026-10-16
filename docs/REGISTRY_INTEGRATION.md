# Anatomy-tree registry integration

The anatomy panel uses the OrganUI registry item `anatomy-tree`, installed with the shadcn CLI. The installed source is tracked in version control; runtime and ordinary setup never contact a registry.

## Exact installation

Installed on 2026-10-16:

```sh
REGISTRY_URL=http://127.0.0.1:4410 bunx shadcn@4.21.0 add http://127.0.0.1:4410/anatomy-tree.json -y
```

The install sandbox's network policy blocked `organui.com` and `ui.shadcn.com`. The item was therefore served from a local static server (`python3 -m http.server 4410`) holding the registry output built from the OrganUI repository at `master` commit **5e20c41**, plus shadcn's `colors/neutral.json` fetched from the shadcn GitHub repository. `REGISTRY_URL` points the CLI's own registry lookups at that server instead of `ui.shadcn.com`. With network access, the equivalent public command is `bunx shadcn@4.21.0 add https://organui.com/r/anatomy-tree.json -y`, but that public artifact was not fetched for this install and may differ from commit 5e20c41.

| Artifact                                | SHA-256                                                            |
| --------------------------------------- | ------------------------------------------------------------------ |
| Served `anatomy-tree.json`              | `f519cf85a68142cb7a054f6b2472649d0dec188c5f2381d4315f12f631874a8e` |
| Embedded `files[0].content`             | `65a226acc9c873559913611b4fadee51935e955ac63dcc64a8dc5bee2d12e821` |
| Tracked `src/components/ui/anatomy-tree.tsx` | `39b294468f2fd06bb81b8c56f485828f941ddfc9065ea5c7c07fdf19582d1842` |

The item declares `@base-ui/react@^1.8.0`. The CLI wrote `^1.8.0` to `package.json`; it was changed back to the exact `1.8.0` to match this repository's exact pins, and `bun install` refreshed the text `bun.lock`. Tailwind CSS and `@tailwindcss/vite` are pinned at 4.1.18, matching the kidney explorer.

## Installed-source differences

The only difference from the published source is that the CLI removed the `"use client"` directive (and the blank line after it) for this non-RSC Vite target (`components.json` sets `"rsc": false`). No behaviour, markup, API, state, or class names changed. The file is listed in `.prettierignore` and must not be hand-edited, so its checksum stays verifiable. The consumer was set up before installing (`components.json`, `@/* -> src/*` alias in `tsconfig.json` and `vite.config.ts`, Tailwind 4 in `src/styles.css`), so the file landed in `src/components/ui/` directly.

## API used

- `data`: four group rows, each with its structure leaves;
- `selectedId` / `onSelectionChange`: the app's single controlled selection;
- `visibility` / `onVisibilityChange`: a map keyed by leaf IDs, where a missing entry means visible;
- `defaultExpandedIds`: all four groups, so the tree initially lists every structure like the old list;
- `label="Heart anatomy"` and `className="registry-tree"`.

Search and expansion stay internal to the component.

## Application adapter

Scene-specific logic lives in `src/anatomy-adapter.ts`, built from the existing `structures` and `groups` in `src/anatomy.ts`:

| Tree ID                      | Scene leaves (GLB `structureId`)                                         | Meaning                                         |
| ---------------------------- | ------------------------------------------------------------------------ | ----------------------------------------------- |
| `group-heart-walls`          | `right-atrium`, `left-atrium`, `ventricular-wall`                         | Interface grouping of the represented walls     |
| `group-ventricular-cavities` | `right-ventricle`, `left-ventricle`                                      | Interface grouping of the cavity surfaces       |
| `group-great-vessels`        | `ascending-aorta`, `aortic-arch`, `pulmonary-trunk`, `superior-vena-cava` | Interface grouping of the included vessel segments |
| `group-coronary-arteries`    | `left-coronary`, `right-coronary`                                        | Interface grouping of the two coronary trees    |

Groups are the headings the hand-built list already used. They are interface groupings only and do not claim anatomical containment (for example, the cavity surfaces are not "inside" the walls group). Every leaf ID is exactly one application structure ID and one GLB node.

The adapter provides `anatomyTree`, `sceneIdsForNode`, `normalizeVisibility`, `visibilityFromHidden` / `hiddenFromVisibility` (the app keeps its existing `hidden` set and converts at the boundary), `isStructureId`, and `assertAnatomyMapping`, which runs at import and throws on missing, unknown, or duplicate leaves. `src/anatomy-adapter.test.ts` covers these with `bun test`.

## Decisions

- **Group rows do not select.** The renderer's emphasis, the details card, and the selection chip all describe exactly one structure, so multi-structure selection would not fit cleanly. Clicking or pressing Enter on a group row leaves the selection unchanged and announces that it is a grouping; group rows still expand/collapse and toggle the visibility of all their structures (showing `Mixed` when partly hidden).
- **Visibility** stays the app's `hidden` set. Tree changes, the detail-card Hide/Show, Isolate, Restore all, the guided tour, and Reset all write that one set.
- **Reset** increments the tree's React `key`, remounting it to clear its internal search and expansion along with selection, visibility, tour, and camera.
- **Search** matches row labels only (the component's behaviour). The old list also matched source names and FMA identifiers; FMA IDs remain visible in the details card. Search is no longer cleared on 3D selection or tour steps, because the component does not expose its query; Reset clears it.
- **Hidden structures are not pickable.** `src/picking.ts` already ignores intersections with invisible meshes or their descendants, so hidden foreground anatomy neither selects itself nor blocks visible surfaces behind it. Hidden structures remain selectable through the tree.
- The app keeps the selected row scrolled into view inside the tree's scroll area, as the old list did.
- Unchanged: selected structure glows in its colour at 0.35 emissive with others ghosted; clicking a structure does not change the view label to "Custom view"; panel closed by default and opened from the header; focus moves into the panel and returns to the toggle on Escape/close; chip name opens the panel; toolbar order is view menu, zoom in, zoom out, reset. `src/framing.ts` was not touched.

## Theme setup

`src/styles.css` imports Tailwind CSS 4 and defines shadcn tokens (`--background`, `--foreground`, `--muted`, `--muted-foreground`, `--accent`, `--border`, `--input`, `--ring`) from the explorer's existing warm neutral palette. The app's own muted text colour was renamed from `--muted` to `--muted-ink` because shadcn uses `--muted` as a background colour.

As in the kidney explorer, the app's global resets moved into `@layer base` after Tailwind preflight, so registry utility classes still win. Preflight changes that would otherwise alter the rest of the app are reverted in that layer: `html` line-height `normal`, heading size/weight and `dialog` margin reverted to browser defaults, and `svg` back to inline display. Closed-panel, selection-chip, and About-dialog screenshots are pixel-identical to the build before this change. Unlayered `.registry-tree` rules fit the component into the panel: no card frame, the previous search-field look with a search glyph, the previous row and hover tints, pill-shaped visibility buttons (dashed when hidden or mixed), and an internally scrolling row area.

## Friction and observations

No registry defect blocked the integration and the component was not modified.

1. The CLI loosened the exact dependency pin to `^1.8.0`; consumers with exact pins need to restore them.
2. Search and expansion are internal. Clearing them needs a remount; the app also cannot clear search when a 3D selection would otherwise be filtered out of view.
3. The search box has no placeholder or icon prop, so the visible label and the CSS search glyph carry that role.
4. Selection callbacks fire for group rows too; a consumer whose selection is leaf-only must ignore them, which leaves the group label button without a visible effect.
5. Row labels are plain text, so the old per-structure colour dots could not be kept without changing the component.

Screen-reader testing of the tree was not done.
