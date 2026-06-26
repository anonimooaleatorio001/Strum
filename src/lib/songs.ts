// A small starter songbook of simple, public-domain melodies in ASCII tab.
// Users can add these in one tap, or import their own tab.

import type { InstrumentId } from "./instruments";

export interface SeedSong {
  id: string;
  title: string;
  artist: string;
  instrument: InstrumentId;
  bpm: number;
  tab: string;
}

export const SEED_SONGS: SeedSong[] = [
  {
    id: "ode-to-joy",
    title: "Ode à Alegria",
    artist: "Beethoven",
    instrument: "GUITAR",
    bpm: 90,
    tab: `e|-------------------------------|
B|-0-0-1-3-3-1-0-----0-----------|
G|-----------------2---2-0--------|
D|-------------------------------|
A|-------------------------------|
E|-------------------------------|`,
  },
  {
    id: "smoke-riff",
    title: "Riff de Fogo",
    artist: "Tradicional",
    instrument: "GUITAR",
    bpm: 112,
    tab: `e|--------------------------------|
B|--------------------------------|
G|-0--3--5----0--3--6-5-----------|
D|-0--3--5----0--3--6-5-----------|
A|--------------------------------|
E|--------------------------------|`,
  },
  {
    id: "happy-birthday",
    title: "Parabéns pra Você",
    artist: "Tradicional",
    instrument: "GUITAR",
    bpm: 100,
    tab: `e|-------------------------------------|
B|-0-0-2-0-5-3---0-0-2-0-7-5-----------|
G|-------------------------------------|
D|-------------------------------------|
A|-------------------------------------|
E|-------------------------------------|`,
  },
  {
    id: "bass-groove",
    title: "Groove Básico",
    artist: "Tradicional",
    instrument: "BASS",
    bpm: 96,
    tab: `G|---------------------------|
D|---------------------------|
A|-----2---2-----------------|
E|-0-0---0---0-3-3-0---------|`,
  },
  {
    id: "bass-walk",
    title: "Walking Blues",
    artist: "Tradicional",
    instrument: "BASS",
    bpm: 104,
    tab: `G|-------------------------------|
D|-------------------0-2-3--------|
A|-------0-2-3-------------------|
E|-0-3-5-------5-3-0-------------|`,
  },
];
