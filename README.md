# OrganUI Heart

An interactive 3D heart explorer for the web.

**Status:** repository initialized; the viewer has not been implemented yet.

This is OrganUI's first standalone anatomy example. The project will combine a focused 3D experience with clear interface controls and source code that developers can run and adapt.

## First release

- Explore an anatomical heart with rotation, zoom, and preset views.
- Select, label, isolate, and restore anatomical structures.
- Browse a searchable structure list linked to the 3D view.
- Follow a short guided exploration.
- Use the interface on desktop and mobile, with keyboard-operable controls and a text alternative for anatomy information.

The initial release is an educational interface demonstration. Model provenance, content review status, and limitations will be documented alongside the implementation.

## Development

The planned foundation is React, TypeScript, Three.js, and Bun. Application scaffolding, dependencies, and verified run commands will be added during implementation.

Read the [build brief](docs/BUILD_BRIEF.md) for the agreed direction and acceptance criteria.

This repository is independent of the OrganUI website monorepo. It should be runnable from its own checkout, without sibling repositories.

## Models and attribution

No third-party anatomy assets are included yet. Each selected asset will have its source, version, license, attribution, and modifications recorded. Third-party models retain their own licenses.

## License

Original project code is licensed under the [MIT License](LICENSE). Third-party models and other assets, when added, are governed by their documented licenses.

Part of [OrganUI](https://github.com/organui).
