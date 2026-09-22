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

## Visual artifacts

- [Desktop](screenshots/desktop.png)
- [Mobile](screenshots/mobile.png)
- [Anatomy menu](screenshots/anatomy.png)
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
