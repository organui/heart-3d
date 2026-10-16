# Verification record

Verified locally on 2026-09-22. No deployment or external posting was performed.

## User story

A visitor loads the bundled GLB, selects real geometry or a source-mapped anatomy entry, inspects its description, changes visibility and camera position, and restores the complete explorer. The same text and controls remain usable if graphics are unavailable.

## Automated checks

- `bun run typecheck`: application, renderer lifecycle, and preparation scripts pass TypeScript checks.
- `bun run build`: production output generated successfully with locally bundled fonts and model.
- `bun run verify:model`: 11 distinct structure/FMA mappings, 63 source meshes, **96,724 triangles**, and **2,524,400 runtime bytes**; checksum, finite coordinates, and face indices verified.
- `bun run prepare:model` followed by comparison with the existing runtime SHA-256: regeneration is byte-identical from the cached, checksum-pinned official inputs.
- `bun run format:check`: application/configuration/preparation files pass.
- Isolated checkout check: copied only tracked/nonignored deliverable files to `.asset-cache/clean-checkout`, with no raw archive, existing node_modules, or sibling repository. `bun install --offline --frozen-lockfile` installed all locked packages from the machine’s package cache; model verification, formatting, type checking, and production build passed. All CLI tools are explicitly run under Bun.
- Production browser: the built output served at `http://127.0.0.1:4173` renders successfully with no console errors; the documented upstream deprecation warning remains.

Runtime SHA-256: `b80a727d022a4ab07ccfcf15caccc228eaccb6d69ec0e72923324946ac35a946`.

## Browser evidence

Interactive checks used the Codex in-app Chromium browser. The minimal layout update was additionally checked at 800 × 700 and 390 × 844, with the sidebar both expanded and collapsed. Desktop viewport: 1440 × 900. Mobile viewport: 390 × 844 (375 CSS pixels of content after the browser's scrollbar). These are actual WebGL renders, not mocked screenshots.

| Check | Observed result |
| --- | --- |
| Minimal layout | Removed the visible hero heading and decorative stage badges; header and canvas use the same neutral background. The sidebar starts collapsed. |
| Menu polish | Header toggle, camera toolbar, anatomy panel, search, detail actions, and tour have no default outline borders. The view selector shows the current angle; selected rows use a soft tint. Search, isolation, presets, zoom, and guided steps work after the styling update; keyboard focus remains visible. |
| Expand/collapse | Header toggle, panel close, and Escape work; closing restores focus to the toggle. Reopening from the selection chip preserves selection and search. Hidden panel controls are removed from keyboard navigation. |
| Centering | The canvas has equal top/bottom insets. All three full-heart presets were visually checked; expanding the sidebar recenters the canvas in the remaining space. |
| Initial load | Real, coherent heart surface renders, including combined ventricular wall and coronary vessels. Eleven structures are available. |
| Mesh selection | Clicked the visible ventricular wall; its anatomy button became pressed, the description showed FMA13884, and the selection chip matched. |
| List/search selection | Searched “aorta”; only ascending aorta and aortic arch remained. Selecting the arch updated the highlight and description. |
| Isolation | Isolating ventricular wall removed all surrounding geometry; count changed to 1 of 11. |
| Hide and restore | Hiding the isolated wall produced “All structures are hidden”; restore returned the full model. |
| Camera presets | Anterior, posterior, and left lateral views visually differ as expected. The selector displays the current preset and marks it with a check in the menu. Manual rotation changes the label to Custom view, while zoom preserves the preset name. The bottom-left orientation marker and label were removed for a simpler layout. |
| View menu | Selecting a preset closes the menu and restores trigger focus. Arrow keys, Enter, Escape, and Tab were checked. Tab exits to Zoom in; clicking outside dismisses the menu. The menu fits the 390 × 844 mobile viewport and selection works without horizontal overflow. |
| Gesture hint | Initially visible; clicking a mesh does not dismiss it. The first pointer drag, keyboard rotation, or zoom button action hides it. Reset keeps it hidden. |
| Rotation and zoom | Pointer drag, keyboard arrow rotation, and zoom buttons visibly changed the camera. |
| Reset | Restored anterior orientation, default zoom, all visibility, empty search, cleared selection, and stopped tour. |
| Tour | Walked all five stops. The third selected posterior left atrium; the fourth isolated FMA9466, explicitly labeled as cavity space. Finishing restored all structures. |
| Mobile | Visually inspected rendering and layout; no horizontal overflow. Mesh selection, text search, cavity isolation, return-to-model, and reset work. |
| Keyboard/dialog | Model arrows rotate; buttons are keyboard operable; Escape closes the labeled credits dialog and focus returns to its trigger. |
| Missing/invalid asset | Temporarily moved the local GLB away. The stage showed a clear model-unavailable message and Retry; anatomy selection/text stayed usable. The original GLB was restored. |
| WebGL startup failure | Temporarily substituted a throwing renderer constructor. The stage showed the graphics fallback, camera buttons were disabled, and anatomy remained usable. Restored the constructor and clicked Try again; rendering and prior selection recovered. |

Failure injections were local and temporary. They are not present in the delivered source. An early test revealed that Fiber's asynchronous default Canvas initialization could reject outside its error boundary; the app now owns renderer initialization, catches that failure, and cleans up its canvas, renderer, listeners, and resize observer.

## Polish pass, 3 October 2026

Re-checked in headless Chromium (SwiftShader WebGL) at 1440 × 900, 390 × 844 and 360 × 740 with no horizontal overflow.

- Selection: the selected structure keeps its color with a slight glow while the rest turn translucent and pale, so posterior and internal structures (left atrium, ventricular cavities) are visible from any view. Previously the selection added a faint tint that was invisible on these warm colors.
- Framing: every preset frames the heart about a third larger; anterior, posterior and left lateral views still clear the stage edges on desktop and phones.
- Rendering: the scene drew continuously when idle because resize reconfiguration reset Fiber's frame loop to `always`. It now stays on demand; draw calls stop once the camera settles.
- Panel: the structure list fades at whichever edge has more rows, so a clipped list reads as scrollable. On phones the list scrolls on its own so the details card is visible right after selecting.
- Text: 7–9 px labels (tour eyebrow, detail eyebrow, review note, footer, status) raised to 9–11 px.
- `bun run test` (2 tests), `bun run typecheck`, `bun run build` and `bun run format:check` passed. Before/after captures are in [screenshots/polish](screenshots/polish); [desktop](screenshots/desktop.png) and [mobile](screenshots/mobile.png) were replaced with current captures.

## Registry anatomy tree, 16 October 2026

The hand-built structure list and its search field were replaced by the OrganUI registry `anatomy-tree` component ([integration record](REGISTRY_INTEGRATION.md)). Checked against a production build in headless Chromium (Playwright 1.56, SwiftShader WebGL) at 1440 × 900 and 390 × 844:

- Panel closed by default; header **Anatomy** opens it and focus moves to the panel; Escape closes it and focus returns to the toggle.
- Tree shows 4 group rows and 11 structure rows. Searching “aort” leaves Great vessels, Ascending aorta, and Aortic arch. Search matches labels only; the old list also matched source names and FMA IDs.
- Selecting a structure row updates the selection chip, details card, and 3D emphasis; the view label stays **Anterior**. Clicking a group row label leaves the selection unchanged.
- Hiding a leaf sets its group to Mixed and the count to 10 of 11; hiding a group hides its four vessels (7 of 11); showing one of them sets the group to Mixed. Isolate, Restore all, and tour isolation are reflected in the tree.
- A 3D click selects the ventricular wall, the chip opens the panel, and the tree row is selected. After hiding the wall, clicking the same point selects the right ventricular cavity behind it: hidden structures are not pickable.
- Reset clears tree search, selection, and visibility; all 15 rows return. Enter selects and Space toggles visibility on a focused row.
- No console errors and no horizontal overflow at either size, with the panel closed or open.
- Closed-panel, selection-chip, and About-dialog captures are pixel-identical to the previous build at both sizes, confirming the Tailwind preflight adjustments do not change the rest of the app.
- `bun install --frozen-lockfile` (fresh `node_modules`), `bun run typecheck`, `bun run test` (10 tests), `bun run build`, and `bun run format:check` passed.

No screen reader was used to test the tree. [Anatomy tree](screenshots/anatomy.png), [mobile anatomy tree](screenshots/anatomy-mobile.png), and [guided isolation](screenshots/guided-isolation.png) were recaptured; `desktop.png` and `mobile.png` show the unchanged closed-panel view.

## Anatomy tree options, 16 October 2026

The registry `anatomy-tree` was reinstalled from organui PR #12 (commit b8e6451, served locally; see the [integration record](REGISTRY_INTEGRATION.md)) to use its new `color`, `selectable`, and reveal behaviour. Checked against a production build in headless Chromium (Playwright 1.56, SwiftShader WebGL) at 1440 × 900 and 390 × 844:

- All 11 structure rows show a swatch whose computed colour equals the structure's mesh colour; the 4 group rows have no swatch and no `aria-selected`.
- Clicking a group label, or pressing Enter on a focused group row, collapses/expands it and leaves the selection unchanged.
- With Great vessels collapsed, a 3D click on the pulmonary trunk expands the group, selects the row, and scrolls it into the tree's visible area. On desktop the page does not move; on mobile the component's reveal also scrolls the page down to the row (recorded as friction).
- A structure picked in 3D with the panel closed is scrolled into the tree's view when the panel opens.
- Searching “aort” and selecting Ascending aorta works; hiding a leaf gives Mixed and 10 of 11; group hide gives 7 of 11; showing one of its leaves gives Mixed and 8 of 11.
- Reset clears search, expansion, visibility, and selection (15 rows, 11 of 11 visible, view **Anterior**). A 3D click keeps the view label at **Anterior**.
- Panel closed by default; the chip and header toggle open it with focus moved into the panel; Escape closes it and returns focus to the toggle. Toolbar order: view menu, zoom in, zoom out, reset.
- No console errors and no horizontal overflow at either size.
- `bun install --frozen-lockfile` (fresh `node_modules`), `bun run typecheck`, `bun run test` (11 tests), `bun run build`, and `bun run format:check` passed.

[Anatomy tree](screenshots/anatomy.png), [mobile anatomy tree](screenshots/anatomy-mobile.png), and [guided isolation](screenshots/guided-isolation.png) were recaptured.

## Visual artifacts

- [Desktop](screenshots/desktop.png)
- [Mobile](screenshots/mobile.png)
- [Anatomy tree](screenshots/anatomy.png)
- [Mobile anatomy tree](screenshots/anatomy-mobile.png)
- [Camera view selector](screenshots/view-menu.png)
- [Guided cavity isolation](screenshots/guided-isolation.png)

These images contain the BodyParts3D model and carry the [model attribution](../public/models/ATTRIBUTION.md).

## Limits of verification

This is not a clinical anatomy review. No physical mobile device or screen reader was tested. Reduced-motion behavior was checked in source: CSS transitions and smooth scrolling are disabled, and OrbitControls damping follows the live preference. Actual hardware GPU context loss was not induced; its listener shares the tested graphics fallback. Pinch zoom uses OrbitControls' touch behavior but was not tested with physical multi-touch hardware.

Vite emits an advisory for the Three.js/Fiber chunk (about 793 kB minified, 209 kB gzip), which is required for the central 3D interaction. The browser emits Fiber's upstream `THREE.Clock` deprecation warning; it does not prevent rendering. Deliberate failure injection generated diagnostic messages during testing; no failure injection remains in the app.

## Repeat the checks

1. Run `bun install --frozen-lockfile`, `bun run verify:model`, and `bun run build` from this repository.
2. Run `bun run preview` and open `http://127.0.0.1:4173`.
3. Expand **Anatomy**, select ventricular wall, isolate it, hide it, restore all, then reset. Close and reopen the panel; confirm that selection/search are preserved.
4. Search “aorta”, select the arch, and try every camera preset, drag rotation, keyboard arrows, and zoom.
5. Complete all five tour stops; confirm cavity labeling and restoration.
6. At a narrow viewport, expand **Anatomy**, search a cavity, isolate it, use **View in 3D** to collapse the panel and return to the model, and reset. Check that page width does not exceed viewport width.
7. Use Tab/Enter and Escape for controls and credits. Review the in-app source notes.

Use a separate local checkout for destructive test fixtures. Do not remove the runtime asset from a shared running demo or publish failure-injection code.

## Cross-explorer consistency pass (10 October 2026)

Selection, framing and the anatomy panel now behave the same in all five OrganUI explorers (brain, heart, kidneys, liver, lungs), using the heart explorer as the reference. A selection lifts the chosen structure in its own color and ghosts the rest to 22% opacity, toned toward the canvas. Every named view is framed by `src/framing.ts`, which fits sampled surface points to the view at a shared 80% fill. The panel starts closed, opens from the header Anatomy button with focus moved into it, and Escape closes it and returns focus to that button. Checked in headless Chromium (SwiftShader WebGL) at 1440×900 and 390×844, with typecheck, tests and build passing.
