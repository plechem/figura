# FIGURA - Project Context for Claude Code

This file is the persistent project brief. Read this before doing anything else.

## What is Figura

A music notation PWA. The core concept is **scale degree notation** - instead of standard noteheads on a five-line staff, notes are represented by their scale degree number (1-7, with accidentals like b3 or #4), positioned on a minimal two-line reference staff. This makes lead lines key-agnostic and instantly transposable.

## Tech Stack (already decided)

- PWA with Capacitor wrapper planned for iOS/Android later
- SVG for all notation rendering (not Canvas)
- Vanilla JS or lightweight framework for now - no heavy dependencies yet
- Offline-first via service worker from day one
- Web MIDI API to be integrated later

## Internal Data Format

The v0.2 JSON schema is in `notation-schema.json` at the repo root. (Schema to be added.)

## Proof of Concept Renderer - Build First

A single bar of scale degree notation rendered as SVG, using the first bar of "Christ Be Magnified" as the example.

### Must include:
- A two-line dashed reference staff (upper line = octave/8, lower line = root/1)
- Scale degree numbers as noteheads, vertically positioned relative to the two reference lines according to their degree and octaveShift value
- Stems (up or down based on position)
- At least one beamed pair of quavers
- A structured chord symbol below the staff rendered in switchable formats
- A key selector dropdown that switches chord display between Nashville (1, 4, 5), Roman numeral (I, IV, V), and named note (C, F, G in key of G) in real time without changing any note data
- Light and dark rendering modes

### Key design decisions to respect:
- **Degree is always canonical.** Transposition is done by changing the document key and re-rendering. No note data changes.
- Bass notes in slash chords are stored relative to the chord root, not the home key
- Chord symbols are fully structured objects, never raw strings
- Beam grouping is defined per bar, not inferred from time signature alone
- The two dashed reference lines represent degree 1 (lower) and degree 8/octave (upper)
- Notes below degree 1 use octaveShift -1, notes above degree 8 use octaveShift 1

### Visual reference:
Notation style is based on hand-sketched examples (pink marker on white/dark background). Aesthetic should be clean, minimal, and music-friendly. Think utility tool, not toy.

## After Renderer Works

Enable GitHub Pages on the repo so the proof of concept is viewable in a browser at the GitHub Pages URL.
