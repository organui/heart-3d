# OrganUI Heart: first-release build brief

## Purpose

Build OrganUI's first public demonstration: a polished, interactive anatomical heart explorer with useful interface controls and reusable source code.

The launch strategy pairs a live demo, a short video, and a public repository. It should make OrganUI's interest in interfaces for health and science tangible and invite feedback from developers and educators. Customer demand and clinical usability have not yet been validated.

## Agreed repository direction

- Repository: `organui/heart-3d`.
- Public title: **OrganUI Heart**.
- Standalone application alongside the existing OrganUI Turborepo.
- This repository contains the application, chosen runtime assets, provenance, documentation, and verification work needed to run it independently.
- The OrganUI monorepo is reserved for the later website, documentation, registry, and packages. Insights from working organ examples will inform those boundaries.
- Further organ examples may receive their own repositories. A common viewer package should follow demonstrated reuse.

## Technology direction

Use React, TypeScript, Three.js, and Bun. A small Vite application is a reasonable starting point; React Three Fiber may be used where it helps implementation. Check current compatibility before selecting dependency versions. This is a proposed implementation direction, not a scaffold that already exists.

The sibling site's Base UI / Nova selection is useful visual context, but this app must not import that repository or require its setup. Choose interface dependencies for this application's needs.

## Model selection comes first

Inspect candidate geometry before committing to interactions. The selected model must have usable anatomical structure identifiers or a documented mapping that enables meaningful selection, labels, and visibility controls. Confirm which internal structures are actually represented.

BodyParts3D is a candidate source. Its official archive license page, checked on 22 September 2026, states CC BY 4.0, with a last-update date of 27 February 2025:

- [Official archive download page](https://dbarchive.biosciencedbc.jp/en/bodyparts3d/download.html)
- [Official archive license](https://dbarchive.biosciencedbc.jp/en/bodyparts3d/lic.html)

Older project pages and downstream copies cite different licenses. Check the exact downloaded source and record the terms that apply. Another candidate, Z-Anatomy, lists mixed source-asset terms in its [attribution file](https://github.com/Z-Anatomy/Models-of-human-anatomy/blob/master/License.txt); evaluate individual assets rather than relying only on a repository-wide license label.

For each included asset, record its source URL, source/version identifier, license, required credits, checksum, preparation steps, and any modifications. Keep large raw downloads and intermediate exports out of ordinary source history. Include practical runtime assets or a reproducible, documented retrieval step so a fresh checkout can run.

## First-release experience

1. Open directly into a carefully composed heart view, with visible loading progress while the model loads.
2. Rotate and zoom with understandable controls and a reliable reset action.
3. Select a structure from the model or the searchable anatomy list; both views reflect the selection.
4. Display the structure's name and a concise sourced explanation.
5. Isolate or hide a structure and restore the full view without losing control of the scene.
6. Offer useful preset camera views and a short guided exploration based on the structures available in the model.
7. Adapt the layout to mobile, support keyboard operation of interface controls, respect reduced-motion preferences, and make anatomy information available as text.
8. Show clear recovery or fallback behavior for missing assets and unavailable WebGL.

Present this as an educational interface demonstration. Record the review status of anatomy labels and explanations. Any later heartbeat, blood-flow, pathology, or treatment feature requires suitable source assets and a separate accuracy review before making corresponding claims.

## Design direction

The heart should be the visual focus. Use restrained typography, a coherent color system, legible annotations, and controls that make the task obvious. The result should look deliberate both in the live app and in a short recording.

Potential demonstration sequence: explore the heart, select a structure, isolate it, restore surrounding anatomy, then navigate to another named view.

## Acceptance criteria

- A fresh checkout can install dependencies and run using documented Bun commands, independently of sibling repositories.
- The real selected heart model renders successfully in a browser.
- Rotation, zoom, reset, selection from both entry points, isolation/restoration, and preset views work.
- Structure labels map to actual model elements; references, limitations, and content-review status are visible in documentation.
- Desktop and mobile layouts are visually inspected. Meaningful interaction checks cover selection and visibility behavior, including reset.
- Applicable type checks and a production build pass. Material browser errors are resolved or clearly reported.
- README includes verified setup commands, screenshots or preview material when available, attribution, and an honest description of the completed scope.

The initial focused task is to build and verify this application locally. A public deployment and social post can be prepared from the completed result when requested.
