# 🎸 Strum

**Learn guitar the fun way.** Strum is a Duolingo-style guitar trainer that puts
the four things a beginner reaches for most — a course, a tuner, a metronome and
a chord library — in one calm, focused place. No sign-up, nothing to install,
and your microphone audio never leaves the device.

Built with **React 18 + TypeScript + Vite + Tailwind CSS**, an animated hero
backdrop from the [`shaders`](https://www.npmjs.com/package/shaders) package, and
the Web Audio API for real tuning and sound.

## Palette

The whole interface is built from just two brand colours and complementary
tints of them:

| Token  | Hex       | Use                              |
| ------ | --------- | -------------------------------- |
| Cyprus | `#004741` | Primary — text, buttons, accents |
| Sand   | `#F0EDE4` | Backgrounds and surfaces         |

A single warm, complementary ochre (`#C8893B`) is used sparingly for the
streak / XP highlights.

## The toolkit

- **Learn** — a winding, level-up lesson path (3 units, 9 lessons). Quizzes mix
  theory questions with "name the chord" diagrams. Earn XP, build a daily
  streak, and unlock the next lesson — all progress is saved to `localStorage`.
- **Tuner** — a real chromatic tuner. It listens through your microphone, detects
  pitch with an autocorrelation (ACF2+) algorithm, and shows the note, cents
  offset and the nearest standard-tuning string (E A D G B E).
- **Metronome** — sample-accurate timing using a Web Audio look-ahead scheduler,
  with a BPM slider, tap tempo, accented down-beats and selectable time
  signatures.
- **Chords** — an interactive library of 16 common chords. Every card shows a
  finger-by-finger diagram and can be tapped to hear it strummed (synthesised
  with Web Audio).

## Getting started

```bash
npm install
npm run dev      # start the dev server
npm run build    # type-check + production build
npm run preview  # preview the production build
```

> The tuner needs microphone permission and a secure context — that means
> `localhost` during development or HTTPS in production.

## Project structure

```
src/
  components/      Hero, Navbar, Toolkit shell, shader backdrop, shared UI
  tools/           Learn path, Tuner, Metronome, Chords + their data
  lib/             pitch detection, Web Audio synth, localStorage hook
  state/           XP / streak / progress context
```
