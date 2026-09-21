import { useEffect, useMemo, useState } from "react";
import { GarageLift } from "./GarageLift";
import { PaintBooth } from "./PaintBooth";
import { CamaroArt, MustangArt, F350Art, Ram3500Art } from "./CarSilhouettes";
import { DiagnosticPanel } from "./DiagnosticPanel";
import { StreetRaceScene } from "./StreetRaceScene";
import { TowMissionScene } from "./TowMissionScene";

type VehicleKind = "camaro" | "mustang" | "f350" | "ram";
type UpgradeKey = "engine" | "suspension" | "tires" | "paint" | "battery";

type CarDefinition = {
  id: VehicleKind;
  name: string;
  price: number;
  accent: string;
  stats: {
    speed: number;
    handling: number;
    reliability: number;
  };
};

type Job = {
  id: string;
  title: string;
  description: string;
  payout: number;
  difficulty: number;
  rewardRep: number;
};

type UpgradeState = Record<UpgradeKey, number>;

const CAR_DEFS: Record<VehicleKind, CarDefinition> = {
  camaro: { id: "camaro", name: "Camaro", price: 18000, accent: "#ef4444", stats: { speed: 92, handling: 84, reliability: 74 } },
  mustang: { id: "mustang", name: "Mustang", price: 21000, accent: "#f5d77d", stats: { speed: 88, handling: 82, reliability: 78 } },
  f350: { id: "f350", name: "F-350", price: 26000, accent: "#60a5fa", stats: { speed: 68, handling: 72, reliability: 92 } },
  ram: { id: "ram", name: "Ram 3500", price: 29000, accent: "#a78bfa", stats: { speed: 62, handling: 70, reliability: 95 } },
};

const JOBS: Job[] = [
  { id: "oil", title: "Oil leak repair", description: "Find the leak and patch the engine bay.", payout: 260, difficulty: 28, rewardRep: 4 },
  { id: "battery", title: "Battery drain diagnosis", description: "Check parasitic draw and restore the charging system.", payout: 340, difficulty: 35, rewardRep: 5 },
  { id: "suspension", title: "Suspension rebuild", description: "Replace worn shocks and reset alignment.", payout: 430, difficulty: 45, rewardRep: 7 },
  { id: "paint", title: "Bodywork and paint refresh", description: "Sand, mask, and finish a paint correction job.", payout: 520, difficulty: 55, rewardRep: 8 },
  { id: "transmission", title: "Transmission rough idle", description: "Diagnose erratic shift behavior and clean the system.", payout: 620, difficulty: 65, rewardRep: 9 },
];

const UPGRADE_COSTS: Record<UpgradeKey, number> = {
  engine: 900,
  suspension: 700,
  tires: 600,
  paint: 800,
  battery: 550,
};

const UPGRADE_LABELS: Record<UpgradeKey, string> = {
  engine: "Engine",
  suspension: "Suspension",
  tires: "Tires",
  paint: "Paint",
  battery: "Battery",
};

type MovingVehicleProps = {
  kind: VehicleKind;
  lane: number;
  x: number;
  y: number;
  speed: number;
  direction: 1 | -1;
  scale?: number;
};

function MovingVehicle({
  kind,
  lane,
  x,
  y,
  speed,
  direction,
  scale = 1,
}: MovingVehicleProps) {
  const [position, setPosition] = useState(x);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();

    const animate = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;

      setPosition((prev) => {
        let next = prev + direction * speed * dt;
        const max = 2400 + 300;
        const min = -300;

        if (direction > 0 && next > max) next = min;
        if (direction < 0 && next < min) next = max;

        return next;
      });

      raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [speed, direction]);

  return (
    <div
      className="pointer-events-none absolute"
      style={{
        left: position,
        top: y + lane * 2,
        transform: `scale(${scale})`,
        transformOrigin: "center center",
      }}
    >
      {kind === "camaro" && <CamaroArt width={360} />}
      {kind === "mustang" && <MustangArt width={360} />}
      {kind === "f350" && <F350Art width={420} />}
      {kind === "ram" && <Ram3500Art width={420} />}
    </div>
  );
}

function ToolWall() {
  const tools = ["Wrench", "Socket", "Tester", "Cables", "Jack", "Scanner"];

  return (
    <div className="absolute left-14 top-24 flex gap-2 rounded-xl border border-white/10 bg-slate-900/80 p-2">
      {tools.map((tool) => (
        <div key={tool} className="rounded-lg border border-slate-700 bg-slate-800/80 px-2 py-1 text-[9px] uppercase tracking-[0.2em] text-slate-200">
          {tool}
        </div>
      ))}
    </div>
  );
}

function LoadingScreen() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#101416] text-white">
      <div className="flex flex-1 items-center justify-center text-center">
        <div className="space-y-4">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-white/15 border-t-amber-400" />
          <h1 className="text-2xl uppercase tracking-[0.22em]">Loading garage bay...</h1>
          <p className="text-sm text-white/55">Preparing diagnostic systems</p>
        </div>
      </div>

      <footer className="w-full border-t border-white/10 bg-[#0a0d10]/80 px-4 py-4 text-center text-[11px] text-white/60">
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
          <span>Powered by Netlify</span>
          <span>•</span>
          <span>Built with Claude AI</span>
          <span>•</span>
          <span>Built with v0</span>
          <span>•</span>
          <span>Hosted with GitHub</span>
        </div>
      </footer>
    </main>
  );
}

function StatBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-slate-400">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-700">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

export function GarageSceneDemo() {
  const [loading, setLoading] = useState(true);
  const [money, setMoney] = useState(2500);
  const [reputation, setReputation] = useState(12);
  const [selectedCar, setSelectedCar] = useState<VehicleKind>("camaro");
  const [towTruck, setTowTruck] = useState<"f350" | "ram">("f350");
  const [scene, setScene] = useState<"garage" | "race" | "tow">("garage");
  const [upgrades, setUpgrades] = useState<UpgradeState>({
    engine: 1,
    suspension: 1,
    tires: 1,
    paint: 1,
    battery: 1,
  });

  const [jobIndex, setJobIndex] = useState(0);
  const [jobProgress, setJobProgress] = useState(0);
  const [currentJob, setCurrentJob] = useState<Job | null>(JOBS[0]);
  const [repairStep, setRepairStep] = useState<"idle" | "active">("idle");
  const [repairMessage, setRepairMessage] = useState("Ready for diagnostics");

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1100);
    return () => clearTimeout(timer);
  }, []);

  const car = CAR_DEFS[selectedCar];

  const currentCarStats = useMemo(() => {
    const engineBoost = upgrades.engine * 7;
    const suspensionBoost = upgrades.suspension * 6;
    const tireBoost = upgrades.tires * 5;
    const paintBoost = upgrades.paint * 3;
    const batteryBoost = upgrades.battery * 4;

    return {
      speed: Math.min(100, car.stats.speed + engineBoost + tireBoost + paintBoost),
      handling: Math.min(100, car.stats.handling + suspensionBoost + tireBoost),
      reliability: Math.min(100, car.stats.reliability + batteryBoost + upgrades.engine * 5),
    };
  }, [car, upgrades]);

  const upgradeCar = (key: UpgradeKey) => {
    const cost = UPGRADE_COSTS[key] * upgrades[key];
    if (money < cost) {
      setRepairMessage(`Need $${cost} for ${UPGRADE_LABELS[key]}`);
      return;
    }

    setMoney((prev) => prev - cost);
    setUpgrades((prev) => ({ ...prev, [key]: prev[key] + 1 }));
    setRepairMessage(`${UPGRADE_LABELS[key]} upgraded`);
  };

  const nextJob = () => {
    const next = JOBS[(jobIndex + 1) % JOBS.length];
    setJobIndex((prev) => (prev + 1) % JOBS.length);
    setCurrentJob(next);
    setJobProgress(0);
    setRepairStep("idle");
    setRepairMessage(`Assigned: ${next.title}`);
  };

  const startRepair = () => {
    if (!currentJob) return;
    setRepairStep("active");
    setRepairMessage(`Repairing: ${currentJob.title}`);
    setJobProgress(0);
  };

  const fixCar = () => {
    if (!currentJob || repairStep !== "active") return;
    const baseGain = 18 + upgrades.engine * 2 + upgrades.battery;
    const random = Math.random() * 18;
    const gain = Math.min(90, baseGain + random);

    setJobProgress((prev) => {
      const next = Math.min(100, prev + gain);
      if (next >= 100) {
        setMoney((m) => m + currentJob.payout);
        setReputation((r) => r + currentJob.rewardRep);
        setRepairMessage(`Job complete! +$${currentJob.payout}`);
        setRepairStep("idle");
        setTimeout(nextJob, 500);
      } else {
        setRepairMessage(`Repairing... ${Math.round(next)}%`);
      }

      return next;
    });
  };

  if (loading) return <LoadingScreen />;

  if (scene === "race") {
    return (
      <StreetRaceScene
        car={selectedCar}
        onExit={() => setScene("garage")}
        onWin={(reward) => {
          setMoney((currentMoney) => currentMoney + reward);
          setRepairMessage(`Race won! +$${reward}`);
        }}
      />
    );
  }

  if (scene === "tow") {
    return (
      <TowMissionScene
        customerCar={selectedCar}
        towTruck={towTruck}
        onExit={() => setScene("garage")}
        onComplete={(reward) => {
          setMoney((currentMoney) => currentMoney + reward);
          setReputation((currentRep) => currentRep + 6);
          setRepairMessage(`Tow completed! +$${reward}`);
        }}
      />
    );
  }

  const movingCars = [
    { kind: "camaro" as const, lane: 0, x: 100, y: 720, speed: 80, direction: 1 as const, scale: 0.8 },
    { kind: "mustang" as const, lane: 1, x: 1700, y: 760, speed: 65, direction: -1 as const, scale: 0.8 },
    { kind: "f350" as const, lane: 2, x: 200, y: 820, speed: 55, direction: 1 as const, scale: 0.9 },
    { kind: "ram" as const, lane: 3, x: 1600, y: 860, speed: 50, direction: -1 as const, scale: 0.85 },
  ];

  return (
    <main className="flex min-h-screen flex-col bg-[#0d1117] text-white">
      <header className="flex items-center justify-between border-b border-white/10 bg-[#12191d] px-4 py-3">
        <div className="space-y-1">
          <p className="text-[10px] uppercase tracking-[0.35em] text-white/45">Garage Bay</p>
          <h1 className="text-xl uppercase tracking-[0.1em]">Cold Start</h1>
        </div>

        <div className="flex items-center gap-4 text-[10px] uppercase tracking-[0.24em] text-white/80">
          <button
            type="button"
            onClick={() => setScene("race")}
            className="rounded-full border border-red-400/40 bg-red-500/10 px-3 py-1 text-red-300 transition hover:bg-red-500/20"
          >
            Street Race
          </button>

          <button
            type="button"
            onClick={() => setScene("tow")}
            className="rounded-full border border-cyan-400/40 bg-cyan-500/10 px-3 py-1 text-cyan-300 transition hover:bg-cyan-500/20"
          >
            Tow Mission
          </button>

          <div className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-emerald-300">
            Cash: ${money}
          </div>

          <div className="rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1 text-amber-300">
            Rep: {reputation}
          </div>
        </div>
      </header>

      <div className="relative flex flex-1 overflow-hidden bg-[#0f1316]">
        <aside className="relative z-20 w-[330px] border-r border-white/10 bg-slate-950/70 p-4 backdrop-blur">
          <div className="mb-5">
            <p className="mb-2 text-[10px] uppercase tracking-[0.3em] text-slate-400">Select vehicle</p>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(CAR_DEFS) as VehicleKind[]).map((key) => (
                <button
                  key={key}
                  onClick={() => setSelectedCar(key)}
                  className={`rounded-xl border px-2 py-3 text-left transition ${
                    selectedCar === key ? "border-amber-400 bg-amber-400/10" : "border-slate-700 bg-slate-900/80 hover:border-slate-500"
                  }`}
                >
                  <div className="mb-1 text-[10px] uppercase tracking-[0.24em] text-slate-400">{CAR_DEFS[key].name}</div>
                  <div className="text-xs text-white/80">${CAR_DEFS[key].price}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-5">
            <p className="mb-2 text-[10px] uppercase tracking-[0.3em] text-slate-400">Tow truck</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTowTruck("f350")}
                className={`rounded-xl border p-3 text-left ${
                  towTruck === "f350" ? "border-cyan-400 bg-cyan-400/10" : "border-slate-700 bg-slate-900/80"
                }`}
              >
                <div className="text-xs font-bold">F-350</div>
                <div className="text-[10px] text-slate-400">Balanced</div>
              </button>

              <button
                type="button"
                onClick={() => setTowTruck("ram")}
                className={`rounded-xl border p-3 text-left ${
                  towTruck === "ram" ? "border-purple-400 bg-purple-400/10" : "border-slate-700 bg-slate-900/80"
                }`}
              >
                <div className="text-xs font-bold">Ram 3500</div>
                <div className="text-[10px] text-slate-400">More reliable</div>
              </button>
            </div>
          </div>

          <div className="mb-5">
            <p className="mb-2 text-[10px] uppercase tracking-[0.3em] text-slate-400">Upgrade garage</p>

            {(Object.keys(UPGRADE_COSTS) as UpgradeKey[]).map((key) => {
              const cost = UPGRADE_COSTS[key] * upgrades[key];
              return (
                <div key={key} className="mb-2 flex items-center justify-between rounded-xl border border-slate-700 bg-slate-900/80 p-2">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">{UPGRADE_LABELS[key]}</div>
                    <div className="text-xs text-white/70">Lvl {upgrades[key]}</div>
                  </div>
                  <button
                    onClick={() => upgradeCar(key)}
                    className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-emerald-300 hover:bg-emerald-500/20"
                  >
                    ${cost}
                  </button>
                </div>
              );
            })}
          </div>

          <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-3">
            <div className="mb-2 text-[10px] uppercase tracking-[0.3em] text-slate-400">Current build</div>
            <div className="space-y-3">
              <StatBar label="Speed" value={currentCarStats.speed} />
              <StatBar label="Handling" value={currentCarStats.handling} />
              <StatBar label="Reliability" value={currentCarStats.reliability} />
            </div>
          </div>
        </aside>

        <div className="relative flex-1 overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(17,24,39,0.2), rgba(7,10,12,0.65)), linear-gradient(to right, rgba(255,255,255,0.04), rgba(255,255,255,0.02), rgba(255,255,255,0.04))",
            }}
          />

          <div
            className="absolute left-0 top-[760px] h-[420px] w-full"
            style={{
              background:
                "linear-gradient(to bottom, rgba(38,42,44,0.28), rgba(14,17,18,0.9)), repeating-linear-gradient(to right, rgba(255,255,255,0.08) 0, rgba(255,255,255,0.08) 2px, transparent 2px, transparent 30px)",
            }}
          />

          <ToolWall />

          <div className="absolute right-8 top-20">
            <DiagnosticPanel
              title="OBD Scanner"
              batteryVoltage={12.4 + upgrades.battery * 0.25}
              rpm={760 + upgrades.engine * 34}
              faultCode={currentJob?.id?.toUpperCase() || "OK"}
            />
          </div>

          <PaintBooth x={980} y={155} width={560} height={260} open={true} />
          <GarageLift x={1040} y={430} width={420} height={260} />

          {movingCars.map((carData, index) => (
            <MovingVehicle key={`${carData.kind}-${index}`} {...carData} />
          ))}

          <div className="absolute left-1/2 top-10 z-20 w-[420px] -translate-x-1/2 rounded-2xl border border-slate-700 bg-slate-950/80 p-3 shadow-2xl">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-[10px] uppercase tracking-[0.3em] text-slate-400">Active repair</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-emerald-300">{currentJob?.title || "No job"}</div>
            </div>

            <div className="mb-3 rounded-xl border border-slate-700 bg-slate-900/80 p-2 text-sm text-slate-200">
              {currentJob?.description}
            </div>

            <div className="mb-3">
              <div className="mb-1 flex items-center justify-between text-[10px] uppercase tracking-[0.25em] text-slate-400">
                <span>Progress</span>
                <span>{Math.round(jobProgress)}%</span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-slate-700">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 transition-all"
                  style={{ width: `${jobProgress}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between gap-2">
              <button
                onClick={startRepair}
                className="flex-1 rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-3 py-2 text-[10px] uppercase tracking-[0.22em] text-cyan-300 hover:bg-cyan-500/20"
              >
                Diagnose
              </button>

              <button
                onClick={fixCar}
                disabled={repairStep !== "active"}
                className="flex-1 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-[10px] uppercase tracking-[0.22em] text-emerald-300 disabled:cursor-not-allowed disabled:opacity-40 hover:bg-emerald-500/20"
              >
                Repair
              </button>
            </div>

            <div className="mt-3 text-center text-[10px] uppercase tracking-[0.22em] text-slate-300">
              {repairMessage}
            </div>
          </div>
        </div>

        <aside className="relative z-20 w-[320px] border-l border-white/10 bg-slate-950/70 p-4 backdrop-blur">
          <div className="mb-5">
            <p className="mb-3 text-[10px] uppercase tracking-[0.3em] text-slate-400">Job board</p>

            <div className="space-y-2">
              {JOBS.map((job, index) => (
                <button
                  key={job.id}
                  onClick={() => {
                    setCurrentJob(job);
                    setJobIndex(index);
                    setJobProgress(0);
                    setRepairStep("idle");
                    setRepairMessage(`Selected: ${job.title}`);
                  }}
                  className={`w-full rounded-xl border p-3 text-left transition ${
                    currentJob?.id === job.id ? "border-amber-400 bg-amber-400/10" : "border-slate-700 bg-slate-900/80 hover:border-slate-500"
                  }`}
                >
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-slate-300">{job.title}</span>
                    <span className="text-[10px] text-emerald-300">${job.payout}</span>
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
                    Difficulty {job.difficulty}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-3">
            <div className="mb-2 text-[10px] uppercase tracking-[0.3em] text-slate-400">Car profile</div>

            <div className="mb-3 flex items-center justify-between">
              <div className="text-xl font-bold">{CAR_DEFS[selectedCar].name}</div>
              <div className="h-3 w-12 rounded-full" style={{ backgroundColor: CAR_DEFS[selectedCar].accent }} />
            </div>

            <div className="space-y-2 text-sm text-slate-300">
              <div className="flex justify-between"><span>Speed</span><span>{currentCarStats.speed}</span></div>
              <div className="flex justify-between"><span>Handling</span><span>{currentCarStats.handling}</span></div>
              <div className="flex justify-between"><span>Reliability</span><span>{currentCarStats.reliability}</span></div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
