import { useEffect, useState } from "react";
import { CamaroArt, MustangArt, F350Art, Ram3500Art } from "./CarSilhouettes";

type VehicleKind = "camaro" | "mustang" | "f350" | "ram";
type TowTruckKind = "f350" | "ram";

type TowMissionSceneProps = {
  customerCar: VehicleKind;
  towTruck: TowTruckKind;
  onExit: () => void;
  onComplete?: (reward: number) => void;
};

type MissionPhase = "driving-to-car" | "at-car" | "towing-home" | "broken-down" | "complete";

function VehicleArt({ kind, width = 150 }: { kind: VehicleKind; width?: number }) {
  if (kind === "camaro") return <CamaroArt width={width} />;
  if (kind === "mustang") return <MustangArt width={width} />;
  if (kind === "f350") return <F350Art width={width + 30} />;
  return <Ram3500Art width={width + 30} />;
}

export function TowMissionScene({
  customerCar,
  towTruck,
  onExit,
  onComplete,
}: TowMissionSceneProps) {
  const [phase, setPhase] = useState<MissionPhase>("driving-to-car");
  const [progress, setProgress] = useState(0);
  const [truckHealth, setTruckHealth] = useState(100);
  const [message, setMessage] = useState("Drive to the stranded vehicle");
  const [rewardPaid, setRewardPaid] = useState(false);

  const isBroken = phase === "broken-down";
  const isMoving = phase === "driving-to-car" || phase === "towing-home";

  useEffect(() => {
    if (!isMoving || isBroken) return;

    const timer = window.setInterval(() => {
      setProgress((current) => {
        const next = Math.min(current + 2, 100);

        if (next >= 100) {
          if (phase === "driving-to-car") {
            setPhase("at-car");
            setMessage("Vehicle located. Attach the tow cable.");
          } else {
            setPhase("complete");
            setMessage("Tow complete. Customer vehicle delivered.");

            if (!rewardPaid) {
              setRewardPaid(true);
              onComplete?.(850);
            }
          }
        }

        return next;
      });

      const breakdownChance = towTruck === "ram" ? 0.035 : 0.05;
      if (Math.random() < breakdownChance) {
        setTruckHealth((current) => {
          const next = Math.max(0, current - 25);

          if (next <= 0) {
            setPhase("broken-down");
            setMessage("The tow truck broke down. Repair it before continuing.");
          }

          return next;
        });
      }
    }, 250);

    return () => window.clearInterval(timer);
  }, [isMoving, isBroken, phase, towTruck, rewardPaid, onComplete]);

  const attachTowCable = () => {
    if (phase !== "at-car") return;

    setProgress(0);
    setPhase("towing-home");
    setMessage("Tow cable attached. Bring the vehicle back to the garage.");
  };

  const repairTruck = () => {
    setTruckHealth(100);
    setPhase(phase === "broken-down" ? "towing-home" : phase);
    setMessage("Truck repaired. Continue the tow.");
  };

  const resetMission = () => {
    setProgress(0);
    setTruckHealth(100);
    setRewardPaid(false);
    setPhase("driving-to-car");
    setMessage("Drive to the stranded vehicle");
  };

  return (
    <main className="min-h-screen bg-[#090c10] text-white">
      <header className="flex items-center justify-between border-b border-white/10 bg-[#12191d] px-5 py-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.35em] text-white/45">Recovery Dispatch</p>
          <h1 className="text-xl font-bold uppercase tracking-[0.14em]">Tow Mission</h1>
        </div>

        <button
          type="button"
          onClick={onExit}
          className="rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-white/75 hover:bg-white/10"
        >
          Return to Garage
        </button>
      </header>

      <section className="flex min-h-[calc(100vh-77px)] items-center justify-center bg-[#111820] p-5">
        <div className="w-full max-w-[900px]">
          <div className="mb-4 grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-white/10 bg-black/50 p-3 text-center">
              <div className="text-[9px] uppercase tracking-[0.2em] text-white/45">Mission</div>
              <div className="text-sm font-bold text-amber-300">
                {phase === "driving-to-car"
                  ? "Outbound"
                  : phase === "at-car"
                    ? "Pickup"
                    : phase === "towing-home"
                      ? "Returning"
                      : phase === "broken-down"
                        ? "Breakdown"
                        : "Complete"}
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/50 p-3 text-center">
              <div className="text-[9px] uppercase tracking-[0.2em] text-white/45">Tow Truck</div>
              <div className="text-sm font-bold text-cyan-300">{towTruck === "f350" ? "F-350" : "Ram 3500"}</div>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/50 p-3 text-center">
              <div className="text-[9px] uppercase tracking-[0.2em] text-white/45">Truck Health</div>
              <div className={`text-sm font-bold ${truckHealth <= 25 ? "text-red-300" : "text-emerald-300"}`}>{truckHealth}%</div>
            </div>
          </div>

          <div className="relative min-h-[430px] overflow-hidden rounded-3xl border-4 border-slate-700 bg-[#24292d] p-6 shadow-2xl">
            <div className="absolute inset-x-0 top-1/2 h-36 -translate-y-1/2 border-y-4 border-yellow-300/70 bg-[#30353a]" />

            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 border-t-2 border-dashed border-white/30" />

            <div
              className="absolute top-1/2 -translate-y-1/2 transition-all duration-200"
              style={{ left: `${Math.max(5, Math.min(progress, 88))}%` }}
            >
              <div className="relative">
                <VehicleArt kind={towTruck} width={155} />
                {phase === "towing-home" && (
                  <div className="absolute left-[85%] top-1/2 h-1 w-32 origin-left rotate-180 bg-yellow-300 shadow-[0_0_8px_rgba(250,204,21,0.8)]" />
                )}
              </div>
            </div>

            {phase !== "towing-home" && phase !== "complete" && (
              <div className="absolute right-12 top-1/2 -translate-y-1/2">
                <VehicleArt kind={customerCar} width={140} />
                <div className="mt-2 text-center text-[9px] uppercase tracking-[0.2em] text-red-300">
                  Stranded vehicle
                </div>
              </div>
            )}

            {phase === "towing-home" && (
              <div className="absolute right-12 top-1/2 -translate-y-1/2 opacity-70">
                <VehicleArt kind={customerCar} width={125} />
              </div>
            )}

            {phase === "broken-down" && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                <div className="rounded-2xl border border-red-400/40 bg-slate-950/95 p-6 text-center shadow-2xl">
                  <div className="mb-2 text-sm font-bold uppercase tracking-[0.25em] text-red-300">Tow Truck Breakdown</div>
                  <p className="mb-4 text-sm text-white/65">The truck lost power while towing.</p>

                  <button
                    type="button"
                    onClick={repairTruck}
                    className="rounded-xl bg-emerald-400 px-5 py-3 text-xs font-bold uppercase tracking-[0.2em] text-black hover:bg-emerald-300"
                  >
                    Repair Truck
                  </button>
                </div>
              </div>
            )}

            {phase === "complete" && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/55">
                <div className="rounded-2xl border border-emerald-400/40 bg-slate-950/95 p-6 text-center shadow-2xl">
                  <div className="mb-2 text-sm font-bold uppercase tracking-[0.25em] text-emerald-300">Tow Complete</div>
                  <p className="mb-4 text-sm text-white/65">Customer vehicle delivered to the garage.</p>

                  <button
                    type="button"
                    onClick={resetMission}
                    className="rounded-xl bg-amber-400 px-5 py-3 text-xs font-bold uppercase tracking-[0.2em] text-black hover:bg-amber-300"
                  >
                    New Tow Job
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 rounded-2xl border border-slate-700 bg-slate-950/80 p-4">
            <div className="mb-3 text-center text-sm text-white/75">{message}</div>

            <div className="mb-4 h-3 overflow-hidden rounded-full bg-slate-700">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-amber-400 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex justify-center gap-3">
              {phase === "at-car" && (
                <button
                  type="button"
                  onClick={attachTowCable}
                  className="rounded-xl bg-amber-400 px-5 py-3 text-xs font-bold uppercase tracking-[0.2em] text-black hover:bg-amber-300"
                >
                  Attach Tow Cable
                </button>
              )}

              {phase === "broken-down" && (
                <button
                  type="button"
                  onClick={repairTruck}
                  className="rounded-xl bg-emerald-400 px-5 py-3 text-xs font-bold uppercase tracking-[0.2em] text-black hover:bg-emerald-300"
                >
                  Repair Truck
                </button>
              )}
            </div>
          </div>

          <p className="mt-4 text-center text-[10px] uppercase tracking-[0.18em] text-white/45">
            The Ram 3500 is more reliable, but every truck can break down.
          </p>
        </div>
      </section>
    </main>
  );
}
