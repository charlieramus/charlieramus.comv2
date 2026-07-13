"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import Motif from "@/components/motif";
import Reveal from "@/components/reveal";
import { sections } from "@/site.config";

// Petal Simon — a small memory game built from the brand motif registry. Watch a
// growing sequence of brand-color flowers light up, then repeat it. Each cleared
// round extends the sequence by one. It's a leaf client component dropped into
// the server-rendered "More than code" bento (replaces the old Playground card).
//
// SSR/export-safe: the initial render is fully deterministic (empty sequence,
// "idle" phase, a fixed status string) — no Math.random until the player presses
// Start after mount, so there's no hydration drift. a11y: the pads are real
// <button>s with color-independent shape + label, a visible focus ring, and an
// aria-live status line. Under prefers-reduced-motion the sequence still plays,
// just slower and without scale/spin (see .psimon* in globals.css).

// Each pad pairs a brand color with a DISTINCT motif shape, so the sequence never
// relies on hue alone (colorblind-safe): red daisy, blue clover, yellow star,
// cyan aster. `token` tints the pad's lit background via a CSS var.
const PADS = [
  { name: "Red daisy", motif: "daisy", fill: "red", accent: "#ffffff", token: "var(--color-red)" },
  { name: "Blue clover", motif: "clover", fill: "blue", accent: "#ffffff", token: "var(--color-blue)" },
  { name: "Yellow star", motif: "star5", fill: "yellow", accent: "#14140f", token: "var(--color-yellow)" },
  { name: "Cyan aster", motif: "aster", fill: "cyan", accent: "#0015d4", token: "var(--color-cyan)" },
] as const;

type Phase = "idle" | "watch" | "input" | "cleared" | "over";

const randomPad = () => Math.floor(Math.random() * PADS.length);
const prefersReduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function PetalSimon() {
  const [sequence, setSequence] = useState<number[]>([]);
  const [phase, setPhase] = useState<Phase>("idle");
  const [lit, setLit] = useState<number | null>(null); // pad lit during playback
  const [pressed, setPressed] = useState<number | null>(null); // input feedback
  const [inputIndex, setInputIndex] = useState(0);
  const [best, setBest] = useState(0);
  const [status, setStatus] = useState(
    "Press Start, watch the flowers, then repeat the sequence.",
  );

  const round = sequence.length;
  const flashTimer = useRef<number | null>(null);

  // Playback: light each pad in the sequence, then hand control to the player.
  // (Only timed, async setState here — the round announcement + resets happen at
  // the transitions that enter "watch", to avoid synchronous cascading renders.)
  useEffect(() => {
    if (phase !== "watch") return;

    let cancelled = false;
    const timers: number[] = [];
    const reduce = prefersReduced();
    const onMs = reduce ? 560 : 420;
    const gapMs = reduce ? 300 : 220;
    let t = 420; // small pause before the first flash

    sequence.forEach((pad) => {
      timers.push(window.setTimeout(() => !cancelled && setLit(pad), t));
      timers.push(window.setTimeout(() => !cancelled && setLit(null), t + onMs));
      t += onMs + gapMs;
    });
    timers.push(
      window.setTimeout(() => {
        if (cancelled) return;
        setPhase("input");
        setInputIndex(0);
        setStatus("Your turn — repeat the sequence.");
      }, t),
    );

    return () => {
      cancelled = true;
      timers.forEach((id) => clearTimeout(id));
    };
  }, [phase, sequence]);

  // A cleared round: brief pause, then extend the sequence and replay it.
  useEffect(() => {
    if (phase !== "cleared") return;
    const id = window.setTimeout(() => {
      setSequence((s) => [...s, randomPad()]);
      setInputIndex(0);
      setLit(null);
      setStatus(`Round ${sequence.length + 1} — watch the sequence.`);
      setPhase("watch");
    }, 680);
    return () => clearTimeout(id);
  }, [phase, sequence.length]);

  // Clean up the input-feedback flash timer on unmount.
  useEffect(
    () => () => {
      if (flashTimer.current) clearTimeout(flashTimer.current);
    },
    [],
  );

  const flash = (pad: number) => {
    if (flashTimer.current) clearTimeout(flashTimer.current);
    setPressed(pad);
    flashTimer.current = window.setTimeout(() => setPressed(null), 240);
  };

  const start = () => {
    setSequence([randomPad()]);
    setInputIndex(0);
    setLit(null);
    setPressed(null);
    setStatus("Round 1 — watch the sequence.");
    setPhase("watch");
  };

  const press = (pad: number) => {
    if (phase !== "input") return;
    flash(pad);

    if (pad !== sequence[inputIndex]) {
      setBest((b) => Math.max(b, sequence.length - 1));
      setPhase("over");
      setStatus(
        `Miss on ${PADS[pad].name}. You reached round ${sequence.length}. Press Play again.`,
      );
      return;
    }

    const next = inputIndex + 1;
    if (next === sequence.length) {
      setBest((b) => Math.max(b, sequence.length));
      setPhase("cleared");
      setStatus(`Round ${sequence.length} cleared — nice.`);
    } else {
      setInputIndex(next);
    }
  };

  // Number keys 1–4 as an optional fast path (native Enter/Space already work).
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (phase !== "input") return;
    const n = Number(e.key);
    if (n >= 1 && n <= PADS.length) {
      e.preventDefault();
      press(n - 1);
    }
  };

  const startLabel =
    phase === "idle" ? "Start game" : phase === "over" ? "Play again" : "Restart";

  return (
    <Reveal className="pcard psimon">
      {/* CUSTOMIZE: playground kicker + game card title in site.config.ts (sections.petalSimon) */}
      <span className="kick">
        <span className="fdot" style={{ background: "var(--color-yellow)" }} />{" "}
        {sections.petalSimon.kicker}
      </span>
      <h3>{sections.petalSimon.title}</h3>

      <div
        className="psimon-pads"
        role="group"
        aria-label="Petal Simon — repeat the flower sequence"
        onKeyDown={onKeyDown}
      >
        {PADS.map((pad, i) => {
          const isLit = lit === i || pressed === i;
          return (
            <button
              key={pad.name}
              type="button"
              className={`psimon-pad${isLit ? " is-lit" : ""}${
                phase === "watch" || phase === "cleared" ? " is-watching" : ""
              }`}
              style={{ "--pad": pad.token } as CSSProperties}
              // Static label — the aria-live status narrates the game, so the
              // per-pad lit state stays a purely visual cue (no re-announcing).
              aria-label={pad.name}
              onClick={() => press(i)}
            >
              <Motif motif={pad.motif} fill={pad.fill} accent={pad.accent} />
            </button>
          );
        })}
      </div>

      <div className="psimon-foot">
        <p className="psimon-status" role="status" aria-live="polite">
          {status}
        </p>
        <div className="psimon-bar">
          <span className="psimon-score">
            Round <b>{round}</b>
            {best > 0 && (
              <>
                {" "}
                · Best <b>{best}</b>
              </>
            )}
          </span>
          <button type="button" className="psimon-start" onClick={start}>
            {startLabel}
          </button>
        </div>
      </div>
    </Reveal>
  );
}
