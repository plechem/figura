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

The v0.2 JSON schema is in `notation-schema.json` at the repo root. Key points:
- `document` → `bars[]` → `notes[]` — hierarchical structure
- `note.degree` is canonical (1–7); never changes on transposition
- `note.octaveShift` drives vertical position: -1 below staff, 0 within, 1 above
- `note.midi.pitch` is for reference only — unused in rendering
- `chordSymbol` is a structured object, never a raw string
- `chordSymbol.bass.degree` is relative to the chord root, not the home key
- Beam grouping is explicit per bar via `beamGrouping` and per-note `beam.type`

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

The app's canonical URL is **https://gofigura.com**.

## Degree Numbering and Multi-Octave Staff — Decided

**Note numbers are always 1–7.** Never compound numbers (8, 9, 10…) and never negative. The octave register is communicated entirely by vertical position relative to the reference lines.

**The staff adapts to the content of the music:**
- The baseline is two dashed reference lines: degree 1 (lower) and degree 8/1 (upper), spanning one octave.
- Space is added above and/or below these lines as needed to accommodate notes at octaveShift ±1 without crowding.
- If the musical content spans into a second octave (i.e. any note has octaveShift 1 or -1), a **third tonic reference line** is drawn at the appropriate edge — one full SPAN above the upper line (for high notes) or one full SPAN below the lower line (for low notes). This third line gives the eye a visual anchor at the octave boundary, the same way the original two lines do.

**Rationale:** Keeping numbers at 1–7 maximises reading speed — musicians already know their degrees. A hook that climbs from degree 5 up through the octave to degree 5 above reads as "5 6 7 1 2 3 4 5", which is instantly singable and transposable. The third reference line prevents the upper (or lower) region from feeling unanchored.

**Implication for the renderer:** Before drawing a bar, scan its notes for the octaveShift range. If any note has octaveShift ≥ 1, extend the SVG height upward and draw the third line at UPPER_Y − SPAN. If any note has octaveShift ≤ −1, extend downward and draw the line at LOWER_Y + SPAN. Chord symbols and stems adjust accordingly.

**Time signature on a three-line staff:** When a bar has three tonic lines, the time signature numerals must fill the full height from the outermost top line to the outermost bottom line (not just the inner two-line span as on a standard bar). The middle tonic line sits at the vertical centre of the time signature, so the two numerals sit in the upper and lower halves respectively. This makes the time signature an immediate visual indicator that this is a three-line staff.

**Barlines on a three-line staff:** Barlines span the full height of all three tonic lines — from the outermost top line to the outermost bottom line. They do not stop at the original inner two lines.

