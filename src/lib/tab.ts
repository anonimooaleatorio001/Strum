// ASCII-tablature parser + the on-disk song shape used by the Songbook.
//
// Accepts the tab notation people paste from the web, e.g.
//   e|-----0-----2-----|
//   B|---1-----3-------|
//   ...
// and turns it into timed notes (string, fret, beat) the player can read.
// Multi-digit frets (10, 12, …) are supported. Columns that contain any note
// are spaced as eighth-notes, which is rhythmically close enough to practise to.

import type { StringDef } from "./instruments";

export interface SongNote {
  string: number; // 0 = lowest tuning string
  fret: number;
  midi: number;
  beat: number;
}

export interface ParsedSong {
  notes: SongNote[];
  bars: number;
  beats: number;
}

const TAB_LINE = /^[\s|]*[eEbBgGdDaA]?[\s|]*[-\dxX|.\s/h pb~()]+$/;

function isTabLine(line: string): boolean {
  const body = line.replace(/^[^|]*\|?/, "");
  const dashes = (body.match(/-/g) ?? []).length;
  return dashes >= 3 && TAB_LINE.test(line);
}

/**
 * Parse tab text for an instrument with `strings` (low -> high). Returns the
 * timed notes, or null if no usable tab block was found.
 */
export function parseTab(text: string, strings: StringDef[]): ParsedSong | null {
  const lines = text.split(/\r?\n/);
  const n = strings.length;

  // gather consecutive runs of tab lines into blocks
  const blocks: string[][] = [];
  let current: string[] = [];
  for (const line of lines) {
    if (isTabLine(line)) {
      current.push(line);
    } else if (current.length) {
      blocks.push(current);
      current = [];
    }
  }
  if (current.length) blocks.push(current);

  const events: { col: number; string: number; fret: number }[] = [];
  let colBase = 0;

  for (const block of blocks) {
    // take the last `n` tab lines of the block (in case of stray text)
    const tabLines = block.slice(-n);
    if (tabLines.length < n) continue;

    // strip the leading "label|" so columns line up
    const bodies = tabLines.map((l) => {
      const bar = l.indexOf("|");
      return bar >= 0 ? l.slice(bar + 1) : l;
    });
    const width = Math.max(...bodies.map((b) => b.length));

    for (let li = 0; li < n; li++) {
      // top tab line = highest string = string index n-1-li
      const stringIdx = n - 1 - li;
      const body = bodies[li];
      for (let c = 0; c < width; c++) {
        const ch = body[c];
        if (ch >= "0" && ch <= "9") {
          // capture a possibly two-digit fret, but only count it once
          if (c > 0 && body[c - 1] >= "0" && body[c - 1] <= "9") continue;
          let num = ch;
          if (body[c + 1] >= "0" && body[c + 1] <= "9") num += body[c + 1];
          events.push({
            col: colBase + c,
            string: stringIdx,
            fret: parseInt(num, 10),
          });
        }
      }
    }
    colBase += width + 2;
  }

  if (!events.length) return null;

  // map distinct note-columns onto an eighth-note grid
  const cols = [...new Set(events.map((e) => e.col))].sort((a, b) => a - b);
  const beatOf = new Map(cols.map((c, i) => [c, i * 0.5]));

  const notes: SongNote[] = events
    .map((e) => ({
      string: e.string,
      fret: e.fret,
      midi: strings[e.string].midi + e.fret,
      beat: beatOf.get(e.col) ?? 0,
    }))
    .sort((a, b) => a.beat - b.beat || a.string - b.string);

  const beats = cols.length * 0.5;
  return { notes, bars: Math.max(1, Math.ceil(beats / 4)), beats };
}
