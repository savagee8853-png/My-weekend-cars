import { useEffect, useMemo, useRef, useState } from "react";
import { CamaroArt, MustangArt, F350Art, Ram3500Art } from "./CarSilhouettes";

type VehicleKind = "camaro" | "mustang" | "f350" | "ram";

type StreetRaceSceneProps = {
  car: VehicleKind;
  onExit: () => void;
  onWin?: (cash: number) => void;
};

type TrafficCar = {
  id: number;
  kind: VehicleKind;
  lane: number;
  distance: number;
  speed: number;
};

const LANES = [30, 50, 70];

const TRAFFIC: TrafficCar[] = [
  { id: 1, kind: "mustang", lane: 0, distance: 150, speed: 0.8 },
  { id: 2, kind: "f350", lane: 2, distance: 310, speed: 0.65 },
  { id: 3, kind: "ram", lane: 1, distance: 510, speed: 0.55 },
  { id: 4, kind: "camaro", lane: 0, distance: 730, speed: 0.75 },
];

function CarSprite({ kind, player = false }: { kind: VehicleKind; player?: boolean }) {
  const className = player
    ? "drop-shadow-[0_0_18px_rgba(250,204,21,0.65)]"
    : "drop-shadow-[0_6px_8px_rgba(0,0,0,0.65)]";

  if (kind === "camaro") return <CamaroArt className={className} width={player ? 145 : 105} />;
  if (kind === "mustang") return <MustangArt className={className} width={player ? 145 : 105} />;
  if (kind === "f350") return <F350Art className={className} width={player ? 165 : 120} />;
  return <Ram3500Art className={className} width={player ? 165 : 120} />;
}

function formatDistance(distance: number) {
  return `${Math.floor(distance)}m`;
}

export function StreetRaceScene({ car, onExit, onWin }: StreetRaceSceneProps) {
  const [lane, setLane] = useState(1);
  const [distance, setDistance] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [boost, setBoost] = useState(100);
  const [raceState, setRaceState] = useState<"ready" | "racing" | "crashed" | "finished">("ready");
  const [message, setMessage] = useState("Press Start Race");

  const laneRef = useRef(1);
  const distanceRef = useRef(0);
  const speedRef = useRef(0);
  const boostRef = useRef(100);
  const keysRef = useRef(new Set<string>());
  const startedRef = useRef(false);
  const paidOutRef = useRef(false);

  const raceLength = 1000;

  const traffic = useMemo(() => TRAFFIC, []);

  const startRace = () => {
    if (raceState === "crashed" || raceState === "finished") {
      laneRef.current = 1;
      distanceRef.current = 0;
      speedRef.current = 0;
      boostRef.current = 100;
      setLane(1);
      setDistance(0);
      setSpeed(0);
      setBoost(100);
      setRaceState("ready");
    }

    startedRef.current = true;
    setRaceState("racing");
    setMessage("Keep your line and avoid traffic");
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();

      if (["arrowleft", "arrowright", "a", "d", " ", "enter"].includes(key)) {
        event.preventDefault();
      }

      keysRef.current.add(key);

      if (key === "enter" && raceState !== "racing") {
        startRace();
      }

      if (raceState !== "racing") return;

      if (key === "arrowleft" || key === "a") {
        const nextLane = Math.max(0, laneRef.current - 1);
        laneRef.current = nextLane;
        setLane(nextLane);
      }

      if (key === "arrowright" || key === "d") {
        const nextLane = Math.min(2, laneRef.current + 1);
        laneRef.current = nextLane;
        setLane(nextLane);
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      keysRef.current.delete(event.key.toLowerCase());
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [raceState]);

  useEffect(() => {
    let animationFrame = 0;
    let lastTime = performance.now();

    const update = (now: number) => {
      const delta = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      if (startedRef.current && raceState === "racing") {
        const isBoosting = keysRef.current.has(" ") && boostRef.current > 0;

        const targetSpeed = isBoosting ? 185 : 120;
        const acceleration = isBoosting ? 85 : 55;

        speedRef.current += (targetSpeed - speedRef.current) * acceleration * delta * 0.02;

        if (isBoosting) {
          boostRef.current = Math.max(0, boostRef.current - 32 * delta);
        } else {
          boostRef.current = Math.min(100, boostRef.current + 9 * delta);
        }

        distanceRef.current += speedRef.current * delta * 0.1;

        setDistance(distanceRef.current);
        setSpeed(Math.round(speedRef.current));
        setBoost(Math.round(boostRef.current));

        const collision = traffic.some((vehicle) => {
          const relativeDistance = vehicle.distance - distanceRef.current;
          return Math.abs(relativeDistance) < 18 && vehicle.lane === laneRef.current;
        });

        if (collision) {
          startedRef.current = false;
          setRaceState("crashed");
          setMessage("Crash! Press Enter to try again");
        }

        if (distanceRef.current >= raceLength) {
          startedRef.current = false;
          setRaceState("finished");
          setMessage("Race complete!");

          if (!paidOutRef.current) {
            paidOutRef.current = true;
            onWin?.(1500);
          }
        }
      }

      animationFrame = requestAnimationFrame(update);
    };

    animationFrame = requestAnimationFrame(update);

    return () => cancelAnimationFrame(animationFrame);
  }, [onWin, raceState, traffic]);

  const roadOffset = (distance * 2) % 120;

  return (
    <main className="min-h-screen bg-[#080b0e] text-white">
      <header className="flex items-center justify-between border-b border-white/10 bg-[#12191d] px-5 py-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.35em] text-white/45">Street Racing District</p>
          <h1 className="text-xl font-bold uppercase tracking-[0.14em]">Midnight Run</h1>
        </div>

        <button
          type="button"
          onClick={onExit}
          className="rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-white/75 hover:bg-white/10"
        >
          Return to Garage
        </button>
      </header>

      <section className="relative flex min-h-[calc(100vh-77px)] items-center justify-center overflow-hidden bg-[#111820] p-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(30,64,175,0.2),transparent_50%)]" />

        <div className="relative z-10 w-full max-w-[720px]">
          <div className="mb-4 grid grid-cols-3 gap-2">
            <div className="rounded-xl border border-white/10 bg-black/50 p-3 text-center">
              <div className="text-[9px] uppercase tracking-[0.2em] text-white/45">Speed</div>
              <div className="text-xl font-bold text-cyan-300">{speed} km/h</div>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/50 p-3 text-center">
              <div className="text-[9px] uppercase tracking-[0.2em] text-white/45">Distance</div>
              <div className="text-xl font-bold text-amber-300">{formatDistance(Math.min(distance, raceLength))}</div>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/50 p-3 text-center">
              <div className="text-[9px] uppercase tracking-[0.2em] text-white/45">Nitro</div>
              <div className="text-xl font-bold text-purple-300">{boost}%</div>
            </div>
          </div>

          <div className="relative h-[650px] overflow-hidden rounded-3xl border-4 border-slate-700 bg-slate-950 shadow-2xl">
            <div className="absolute inset-y-0 left-[12%] right-[12%] bg-[#30343a]" />

            <div className="absolute inset-y-0 left-[12%] right-[12%]">
              <div
                className="absolute inset-0 opacity-40"
                style={{
                  backgroundImage: `repeating-linear-gradient(
                    to bottom,
                    transparent 0px,
                    transparent 60px,
                    rgba(255,255,255,0.8) 60px,
                    rgba(255,255,255,0.8) 105px,
                    transparent 105px,
                    transparent 120px
                  )`,
                  backgroundPosition: `0 ${roadOffset}px`,
                }}
              />
            </div>

            <div className="absolute inset-y-0 left-[12%] w-2 bg-yellow-300/80" />
            <div className="absolute inset-y-0 right-[12%] w-2 bg-yellow-300/80" />

            <div className="absolute left-1/2 top-5 -translate-x-1/2 rounded-full border border-red-400/40 bg-red-500/20 px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-red-200">
              {raceState === "racing" ? "Race Live" : raceState}
            </div>

            {traffic.map((vehicle) => {
              const relativeDistance = vehicle.distance - distance + 250;

              if (relativeDistance < -100 || relativeDistance > 700) return null;

              const top = 650 - relativeDistance * 0.75;
              const left = `${LANES[vehicle.lane]}%`;

              return (
                <div
                  key={vehicle.id}
                  className="absolute -translate-x-1/2 transition-transform"
                  style={{ top, left, transform: "translateX(-50%) scale(0.8)" }}
                >
                  <CarSprite kind={vehicle.kind} />
                </div>
              );
            })}

            <div
              className="absolute bottom-8 -translate-x-1/2"
              style={{ left: `${LANES[lane]}%` }}
            >
              <CarSprite kind={car} player />
            </div>

            {raceState !== "racing" && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <div className="w-[300px] rounded-2xl border border-white/15 bg-slate-950/90 p-5 text-center shadow-2xl">
                  <div className="mb-2 text-xs uppercase tracking-[0.28em] text-amber-300">
                    {raceState === "finished" ? "Victory" : raceState === "crashed" ? "Wrecked" : "Ready"}
                  </div>

                  <p className="mb-5 text-sm text-white/70">{message}</p>

                  <button
                    type="button"
                    onClick={startRace}
                    className="w-full rounded-xl bg-amber-400 px-4 py-3 text-xs font-bold uppercase tracking-[0.2em] text-black hover:bg-amber-300"
                  >
                    {raceState === "ready" ? "Start Race" : "Race Again"}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 rounded-xl border border-white/10 bg-black/50 p-3 text-center text-[10px] uppercase tracking-[0.18em] text-white/55">
            A/D or arrow keys: change lanes&nbsp;&nbsp; • &nbsp;&nbsp;Space: nitro&nbsp;&nbsp; • &nbsp;&nbsp;Enter: start
          </div>
        </div>
      </section>
    </main>
  );
}
