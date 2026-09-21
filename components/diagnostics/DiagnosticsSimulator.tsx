"use client";

import { useMemo, useState } from "react";

type Difficulty = "basic" | "advanced" | "specialist";
type Tool = "meter" | "scope" | "scanner" | "diagram";
type Probe = "power" | "ground" | "signal";

type Fault = {
  id: string;
  title: string;
  component: string;
  symptom: string;
  fix: string;
  difficulty: Difficulty;
  readings: Record<Probe, string>;
  hint: string;
};

const faults: Fault[] = [
  {
    id: "map-ground",
    title: "MAP sensor ground open",
    component: "MAP sensor",
    symptom: "Engine hesitates under load and stores P0107.",
    fix: "Repair the ground circuit and clear the code.",
    difficulty: "basic",
    readings: { power: "5.02 V", ground: "OL", signal: "4.98 V" },
    hint: "A sensor needs a stable reference ground before its signal can be trusted.",
  },
  {
    id: "crank-signal",
    title: "Crankshaft signal dropout",
    component: "Crankshaft position sensor",
    symptom: "The starter turns, but the engine will not run.",
    fix: "Replace the damaged signal sensor and verify the waveform.",
    difficulty: "advanced",
    readings: { power: "12.1 V", ground: "0.03 V", signal: "0.00 V" },
    hint: "Use the oscilloscope on the signal circuit while cranking.",
  },
  {
    id: "injector-power",
    title: "Injector power feed shorted",
    component: "Fuel injector bank",
    symptom: "Multiple misfires and an overheated injector fuse.",
    fix: "Repair the shorted power feed, then retest all injectors.",
    difficulty: "specialist",
    readings: { power: "0.42 V", ground: "0.02 V", signal: "12.0 V" },
    hint: "Compare supply voltage at the fuse and at the component connector.",
  },
];

const toolLabels: Record<Tool, string> = {
  meter: "Multimeter",
  scope: "Oscilloscope",
  scanner: "Scan tool",
  diagram: "Wiring diagram",
};

export function DiagnosticsSimulator() {
  const [difficulty, setDifficulty] = useState<Difficulty>("basic");
  const [mode, setMode] = useState<"practice" | "challenge">("challenge");
  const [tool, setTool] = useState<Tool>("scanner");
  const [probe, setProbe] = useState<Probe>("power");
  const [faultIndex, setFaultIndex] = useState(0);
  const [selectedComponent, setSelectedComponent] = useState("MAP sensor");
  const [score, setScore] = useState(0);
  const [tests, setTests] = useState(0);
  const [message, setMessage] = useState("Select a tool, then test a circuit.");
  const [solved, setSolved] = useState(false);

  const visibleFaults = useMemo(
    () => faults.filter((fault) => difficulty === "basic" || fault.difficulty !== "basic"),
    [difficulty],
  );
  const fault = visibleFaults[faultIndex % visibleFaults.length] ?? faults[0];

  const inspect = () => {
    setTests((current) => current + 1);
    if (mode === "practice") {
      setMessage(`Practice reading: ${fault.readings[probe]}. No fault is active.`);
      return;
    }
    if (tool === "scanner") {
      setMessage(`Scan result: ${fault.id === "map-ground" ? "P0107" : fault.id === "crank-signal" ? "P0335" : "P0201"}. Confirm with a circuit test.`);
    } else if (tool === "scope") {
      setMessage(`${fault.component} ${probe} waveform: ${fault.readings[probe]}. Compare it with the expected pattern.`);
    } else if (tool === "diagram") {
      setMessage(`Diagram view: trace the ${probe} wire from the ECU to the ${fault.component}.`);
    } else {
      setMessage(`${fault.component} ${probe} reading: ${fault.readings[probe]}`);
    }
  };

  const repair = () => {
    if (mode === "practice") {
      setMessage("Practice mode has no active fault. Switch to Challenge mode to repair a vehicle.");
      return;
    }
    setSolved(true);
    setScore((current) => current + Math.max(100 - tests * 10, 40));
    setMessage(`Repair verified: ${fault.fix}`);
  };

  const nextFault = () => {
    setFaultIndex((current) => (current + 1) % visibleFaults.length);
    setSolved(false);
    setTests(0);
    setMessage("New fault loaded. Start with the scanner or wiring diagram.");
  };

  return (
    <main className="min-h-screen bg-[#071014] text-white">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 bg-[#101b20] px-5 py-4">
        <div>
          <a href="/" className="text-[10px] uppercase tracking-[0.3em] text-cyan-300">← Back to Cold Start</a>
          <h1 className="mt-2 text-2xl font-black uppercase tracking-[0.14em]">Diagnostics Lab</h1>
          <p className="text-sm text-white/55">Interactive engine-management practice bay</p>
        </div>
        <div className="flex gap-2 text-center">
          <div className="rounded-xl border border-amber-300/30 bg-amber-400/10 px-4 py-2"><div className="text-[9px] uppercase tracking-widest text-amber-200/70">Score</div><strong>{score}</strong></div>
          <div className="rounded-xl border border-cyan-300/30 bg-cyan-400/10 px-4 py-2"><div className="text-[9px] uppercase tracking-widest text-cyan-200/70">Tests</div><strong>{tests}</strong></div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1400px] gap-5 p-5 lg:grid-cols-[250px_1fr_300px]">
        <aside className="space-y-4 rounded-2xl border border-white/10 bg-[#0d1a20] p-4">
          <div><div className="mb-2 text-[10px] uppercase tracking-[0.25em] text-white/45">Mode</div><div className="grid grid-cols-2 gap-2">{(["practice", "challenge"] as const).map((item) => <button key={item} onClick={() => setMode(item)} className={`rounded-lg px-2 py-3 text-[10px] font-bold uppercase tracking-widest ${mode === item ? "bg-cyan-400 text-slate-950" : "bg-white/5 text-white/60"}`}>{item}</button>)}</div></div>
          <div><div className="mb-2 text-[10px] uppercase tracking-[0.25em] text-white/45">Difficulty</div><div className="space-y-2">{(["basic", "advanced", "specialist"] as const).map((item) => <button key={item} onClick={() => { setDifficulty(item); setFaultIndex(0); setSolved(false); }} className={`w-full rounded-lg border px-3 py-2 text-left text-xs uppercase tracking-widest ${difficulty === item ? "border-amber-300 bg-amber-400/10 text-amber-200" : "border-white/10 text-white/55"}`}>{item}</button>)}</div></div>
          <div><div className="mb-2 text-[10px] uppercase tracking-[0.25em] text-white/45">Tools</div><div className="space-y-2">{(Object.keys(toolLabels) as Tool[]).map((item) => <button key={item} onClick={() => setTool(item)} className={`w-full rounded-lg border px-3 py-2 text-left text-xs ${tool === item ? "border-cyan-300 bg-cyan-400/10 text-cyan-200" : "border-white/10 text-white/55"}`}>{toolLabels[item]}</button>)}</div></div>
        </aside>

        <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#16252a] p-5 shadow-2xl">
          <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)", backgroundSize: "42px 42px" }} />
          <div className="relative">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><div><p className="text-[10px] uppercase tracking-[0.3em] text-cyan-300">Vehicle: training engine</p><h2 className="text-xl font-bold">{fault.title}</h2></div><span className={`rounded-full px-3 py-1 text-[10px] uppercase tracking-widest ${solved ? "bg-emerald-400/20 text-emerald-300" : "bg-red-400/15 text-red-200"}`}>{solved ? "Verified" : "Fault active"}</span></div>
            <div className="mb-5 rounded-2xl border border-white/10 bg-[#0a1317]/80 p-5"><div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">{["ECU", "Fuse box", "Sensors", "Actuators"].map((part) => <button key={part} onClick={() => setSelectedComponent(part)} className={`rounded-xl border p-4 text-left transition ${selectedComponent === part ? "border-amber-300 bg-amber-400/10" : "border-white/10 bg-white/[.03] hover:border-white/30"}`}><div className="mb-3 h-10 rounded bg-gradient-to-br from-slate-600 to-slate-900" /><div className="text-xs font-bold">{part}</div><div className="text-[10px] text-white/40">Click to inspect</div></button>)}</div><div className="flex min-h-[150px] items-center justify-center rounded-xl border border-dashed border-cyan-300/30 bg-cyan-400/[.04] text-center"><div><div className="text-5xl">⚙</div><div className="mt-2 text-xs uppercase tracking-widest text-cyan-200">{selectedComponent}</div><p className="mt-2 max-w-md text-sm text-white/50">{fault.symptom}</p></div></div></div>
            <div className="grid gap-3 md:grid-cols-3"><div className="rounded-xl border border-white/10 bg-black/20 p-3"><div className="mb-2 text-[10px] uppercase tracking-widest text-white/40">Probe point</div><div className="flex gap-2">{(["power", "ground", "signal"] as Probe[]).map((item) => <button key={item} onClick={() => setProbe(item)} className={`flex-1 rounded px-2 py-2 text-[10px] uppercase ${probe === item ? "bg-amber-400 text-black" : "bg-white/10 text-white/60"}`}>{item}</button>)}</div></div><button onClick={inspect} className="rounded-xl bg-cyan-400 px-4 py-3 text-xs font-black uppercase tracking-widest text-slate-950 hover:bg-cyan-300">Run {toolLabels[tool]} test</button><button onClick={repair} className="rounded-xl border border-emerald-300/40 bg-emerald-400/10 px-4 py-3 text-xs font-black uppercase tracking-widest text-emerald-200 hover:bg-emerald-400/20">Verify repair</button></div>
          </div>
        </section>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-[#0d1a20] p-4"><div className="mb-2 text-[10px] uppercase tracking-[0.25em] text-white/45">Live reading</div><div className="rounded-xl bg-black/30 p-4 text-center"><div className="text-3xl font-black text-amber-300">{mode === "practice" ? fault.readings[probe] : tool === "scanner" ? "P0---" : "Awaiting test"}</div><div className="mt-2 text-[10px] uppercase tracking-widest text-white/40">{probe} circuit</div></div><p className="mt-3 text-sm leading-6 text-white/60">{message}</p></div>
          <div className="rounded-2xl border border-amber-300/20 bg-amber-400/[.06] p-4"><div className="mb-2 text-[10px] uppercase tracking-[0.25em] text-amber-200/70">Technician hint</div><p className="text-sm leading-6 text-amber-100/75">{fault.hint}</p></div>
          <button onClick={nextFault} className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-xs font-bold uppercase tracking-widest text-white/75 hover:bg-white/10">Load next fault</button>
        </aside>
      </div>
    </main>
  );
}
