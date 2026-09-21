import { useCallback, useEffect, useState } from "react";

type GarageLiftProps = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  minHeight?: number;
  maxHeight?: number;
};

export function GarageLift({
  x = 0,
  y = 0,
  width = 420,
  height = 260,
  minHeight = 0,
  maxHeight = 100,
}: GarageLiftProps) {
  const [liftHeight, setLiftHeight] = useState(0);

  const isDown = liftHeight <= minHeight;
  const isUp = liftHeight >= maxHeight;

  const raiseLift = useCallback(() => {
    setLiftHeight((current) => Math.min(current + 10, maxHeight));
  }, [maxHeight]);

  const lowerLift = useCallback(() => {
    setLiftHeight((current) => Math.max(current - 10, minHeight));
  }, [minHeight]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!event.shiftKey) return;

      const key = event.key.toLowerCase();

      if (key === "r") {
        event.preventDefault();
        raiseLift();
      }

      if (key === "l") {
        event.preventDefault();
        lowerLift();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [raiseLift, lowerLift]);

  const platformY = 145 - liftHeight;
  const postTopY = platformY + 24;

  return (
    <div
      className="absolute"
      style={{
        left: x,
        top: y,
        width,
        height,
      }}
    >
      <svg
        viewBox="0 0 420 260"
        width="100%"
        height="100%"
        aria-label="Vehicle lift"
        role="img"
      >
        <ellipse cx="210" cy="230" rx="170" ry="16" fill="rgba(0,0,0,0.35)" />
        <rect x="72" y={postTopY} width="28" height={230 - postTopY} rx="8" fill="#4b5563" />
        <rect x="320" y={postTopY} width="28" height={230 - postTopY} rx="8" fill="#4b5563" />
        <rect x="82" y={postTopY + 10} width="8" height={Math.max(20, 170 - liftHeight)} rx="4" fill="#9ca3af" />
        <rect x="330" y={postTopY + 10} width="8" height={Math.max(20, 170 - liftHeight)} rx="4" fill="#9ca3af" />

        <g
          style={{
            transform: `translateY(${-liftHeight}px)`,
            transition: "transform 350ms ease",
          }}
        >
          <rect x="38" y="145" width="344" height="24" rx="7" fill="#cbd5e1" stroke="#374151" strokeWidth="3" />
          <rect x="64" y="169" width="292" height="16" rx="6" fill="#e5e7eb" stroke="#4b5563" strokeWidth="2" />
          <rect x="78" y="133" width="75" height="12" rx="4" fill="#6b7280" />
          <rect x="267" y="133" width="75" height="12" rx="4" fill="#6b7280" />
        </g>

        <rect x="48" y="224" width="76" height="12" rx="5" fill="#1f2937" />
        <rect x="296" y="224" width="76" height="12" rx="5" fill="#1f2937" />
      </svg>

      <div className="pointer-events-auto absolute right-2 top-2 flex flex-col gap-1 rounded-md border border-white/20 bg-black/75 p-1.5 shadow-lg">
        <button
          type="button"
          onClick={raiseLift}
          disabled={isUp}
          className="rounded bg-emerald-500 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-35"
          aria-label="Raise vehicle lift"
        >
          ▲ Up
        </button>

        <button
          type="button"
          onClick={lowerLift}
          disabled={isDown}
          className="rounded bg-red-500 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-35"
          aria-label="Lower vehicle lift"
        >
          ▼ Down
        </button>
      </div>

      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-black/65 px-2 py-1 text-[9px] uppercase tracking-wide text-white/70">
        Shift + R: raise&nbsp;&nbsp; Shift + L: lower
      </div>
    </div>
  );
}
