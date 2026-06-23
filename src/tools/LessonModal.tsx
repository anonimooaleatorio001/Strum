import { useEffect, useState } from "react";
import { X, Check, Trophy } from "lucide-react";
import type { Lesson } from "./lessonData";
import { CHORDS } from "./chordData";
import ChordDiagram from "../components/ChordDiagram";
import { strumChord } from "../lib/audio";

interface Props {
  lesson: Lesson;
  onClose: () => void;
  onComplete: (xp: number) => void;
}

export default function LessonModal({ lesson, onClose, onComplete }: Props) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const question = lesson.questions[index];
  const total = lesson.questions.length;
  const isCorrect = selected === question?.answer;

  const handleCheck = () => {
    if (selected === null) return;
    setChecked(true);
    if (selected === question.answer) setCorrect((c) => c + 1);
  };

  const handleContinue = () => {
    if (index + 1 >= total) {
      setFinished(true);
    } else {
      setIndex((i) => i + 1);
      setSelected(null);
      setChecked(false);
    }
  };

  const chord =
    question?.kind === "chord"
      ? CHORDS.find((c) => c.display === question.chord)
      : undefined;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-sand">
      {/* Top bar */}
      <div className="flex items-center gap-4 px-4 sm:px-8 pt-5">
        <button
          onClick={onClose}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-cyprus/60 transition-colors hover:bg-cyprus/10 hover:text-cyprus"
          aria-label="Close lesson"
        >
          <X size={22} />
        </button>
        <div className="h-3.5 flex-1 overflow-hidden rounded-full bg-cyprus/10">
          <div
            className="h-full rounded-full bg-cyprus transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
            style={{
              width: `${((finished ? total : index) / total) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 items-center justify-center overflow-y-auto px-5 py-8">
        {finished ? (
          <div className="animate-pop text-center">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-cyprus text-sand">
              <Trophy size={44} strokeWidth={1.8} />
            </div>
            <h3 className="mt-6 text-2xl font-semibold text-cyprus">
              Lesson complete!
            </h3>
            <p className="mt-2 text-cyprus/60">
              You got {correct} of {total} right.
            </p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-cyprus/10 px-5 py-2 text-cyprus">
              <span className="text-lg font-bold">+{lesson.xp}</span>
              <span className="text-sm font-medium">XP</span>
            </div>
            <div className="mt-8">
              <button
                onClick={() => onComplete(lesson.xp)}
                className="rounded-full bg-cyprus px-10 py-3.5 text-sm font-semibold text-sand transition-colors hover:bg-[#013a35]"
              >
                Claim XP
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-xl">
            <p className="text-[13px] font-semibold uppercase tracking-wide text-cyprus/45">
              {lesson.title} · Question {index + 1} of {total}
            </p>
            <h3 className="mt-2 text-2xl sm:text-3xl font-semibold leading-tight text-cyprus">
              {question.prompt}
            </h3>

            {chord && (
              <button
                onClick={() => strumChord(chord.midi)}
                className="mt-6 flex w-full flex-col items-center rounded-2xl border border-cyprus/10 bg-sand py-5 transition-colors hover:bg-cyprus/[0.03]"
              >
                <ChordDiagram frets={chord.frets} fingers={chord.fingers} size={1.25} showFingers={false} />
                <span className="mt-2 text-[11px] font-medium text-cyprus/45">
                  tap to hear it
                </span>
              </button>
            )}

            <div className="mt-6 grid gap-3">
              {question.options.map((opt, i) => {
                let style =
                  "border-cyprus/15 bg-sand text-cyprus hover:border-cyprus/40";
                if (checked) {
                  if (i === question.answer)
                    style = "border-cyprus bg-cyprus/10 text-cyprus";
                  else if (i === selected)
                    style = "border-cyprus/20 bg-cyprus/5 text-cyprus/45 line-through";
                  else style = "border-cyprus/10 bg-sand text-cyprus/35";
                } else if (i === selected) {
                  style = "border-cyprus bg-cyprus/[0.06] text-cyprus";
                }
                return (
                  <button
                    key={i}
                    disabled={checked}
                    onClick={() => setSelected(i)}
                    className={`flex items-center justify-between rounded-2xl border-2 px-5 py-4 text-left text-[15px] font-medium transition-all duration-150 ${style}`}
                  >
                    <span>{opt}</span>
                    {checked && i === question.answer && (
                      <Check size={18} strokeWidth={2.6} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      {!finished && (
        <div
          className={`border-t-2 transition-colors duration-200 ${
            checked
              ? isCorrect
                ? "border-cyprus/20 bg-cyprus/[0.05]"
                : "border-cyprus/10 bg-sand"
              : "border-cyprus/10 bg-sand"
          }`}
        >
          <div className="mx-auto flex max-w-xl items-center justify-between gap-4 px-5 py-5">
            <div className="min-h-[24px] text-sm font-semibold text-cyprus">
              {checked &&
                (isCorrect ? (
                  <span className="inline-flex items-center gap-1.5">
                    <Check size={18} strokeWidth={2.6} /> Nicely done!
                  </span>
                ) : (
                  <span className="text-cyprus/70">
                    Answer: {question.options[question.answer]}
                  </span>
                ))}
            </div>
            {checked ? (
              <button
                onClick={handleContinue}
                className="rounded-full bg-cyprus px-8 py-3 text-sm font-semibold text-sand transition-colors hover:bg-[#013a35]"
              >
                Continue
              </button>
            ) : (
              <button
                onClick={handleCheck}
                disabled={selected === null}
                className="rounded-full bg-cyprus px-8 py-3 text-sm font-semibold text-sand transition-colors hover:bg-[#013a35] disabled:cursor-not-allowed disabled:bg-cyprus/25"
              >
                Check
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
