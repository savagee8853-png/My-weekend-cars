"use client";

import { useEffect, useMemo, useState } from "react";

type Difficulty = "basic" | "advanced" | "specialist";
type Tool = "meter" | "scope" | "scanner" | "diagram";
type Probe = "power" | "ground" | "signal";
type Step = "inspect" | "scan" | "test" | "diagnose" | "repair" | "verify";

type Fault = {
  id: string;
  code: string;
  title: string;
  component: string;
  symptom: string;
  fix: string;
  difficulty: Difficulty;
  readings: Record<Probe, string>;
  expected: Record<Probe, string>;
  hint: string;
  partsCost: number;
};

const faults: Fault[] = [
  { id: "map-ground", code: "P0107", title: "MAP sensor ground open", component: "MAP sensor", symptom: "Engine hesitates under load and the MAP signal is implausibly high.", fix: "Repair the sensor ground circuit and clear the code.", difficulty: "basic", readings: { power: "5.02 V", ground: "OL", signal: "4.98 V" }, expected: { power: "5 V reference", ground: "< 0.10 V", signal: "0.8–4.5 V" }, hint: "A sensor needs a stable reference ground before its signal can be trusted.", partsCost: 85 },
  { id: "crank-signal", code: "P0335", title: "Crankshaft signal dropout", component: "Crankshaft position sensor", symptom: "The starter turns, but the engine will not run and RPM stays at zero.", fix: "Replace the damaged sensor and verify the waveform while cranking.", difficulty: "advanced", readings: { power: "12.1 V", ground: "0.03 V", signal: "0.00 V" }, expected: { power: "11–14 V", ground: "< 0.10 V", signal: "AC waveform" }, hint: "Use the oscilloscope on the signal circuit while cranking.", partsCost: 140 },
  { id: "injector-power", code: "P0201", title: "Injector power feed shorted", component: "Fuel injector bank", symptom: "Multiple misfires and an overheated injector fuse are reported.", fix: "Repair the shorted power feed, then retest the injector bank.", difficulty: "specialist", readings: { power: "0.42 V", ground: "0.02 V", signal: "12.0 V" }, expected: { power: "11–14 V", ground: "< 0.10 V", signal: "PWM pulse" }, hint: "Compare supply voltage at the fuse and at the component connector.", partsCost: 210 },
];

const tools: Record<Tool, string> = { meter: "Multimeter", scope: "Oscilloscope", scanner: "Scan tool", diagram: "Wiring diagram" };
const steps: Step[] = ["inspect", "scan", "test", "diagnose", "repair", "verify"];
const stepLabels: Record<Step, string> = { inspect: "Inspect", scan: "Scan", test: "Test", diagnose: "Diagnose", repair: "Repair", verify: "Verify" };

export function DiagnosticsSimulator() {
  const [difficulty, setDifficulty] = useState<Difficulty>("basic");
  const [mode, setMode] = useState<"practice" | "challenge">("challenge");
  const [tool, setTool] = useState<Tool>("scanner");
  const [probe, setProbe] = useState<Probe>("power");
  const [faultIndex, setFaultIndex] = useState(0);
  const [component, setComponent] = useState("MAP sensor");
  const [step, setStep] = useState<Step>("inspect");
  const [score, setScore] = useState(0);
  const [tests, setTests] = useState(0);
  const [solved, setSolved] = useState(false);
  const [repairApplied, setRepairApplied] = useState(false);
  const [diagnosis, setDiagnosis] = useState("");
  const [message, setMessage] = useState("Begin with a visual inspection of the customer complaint.");
  const [history, setHistory] = useState<string[]>([]);

  const visibleFaults = useMemo(() => faults.filter((fault) => difficulty === "basic" || fault.difficulty !== "basic"), [difficulty]);
  const fault = visibleFaults[faultIndex % visibleFaults.length] ?? faults[0];

  useEffect(() => {
    const saved = window.localStorage.getItem("cold-start-diagnostics");
    if (!saved) return;
    try {
      const data = JSON.parse(saved) as { score?: number; history?: string[] };
      if (typeof data.score === "number") setScore(data.score);
      if (Array.isArray(data.history)) setHistory(data.history.slice(0, 6));
    } catch { /* Ignore corrupt local progress. */ }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("cold-start-diagnostics", JSON.stringify({ score, history }));
  }, [score, history]);

  const log = (text: string) => {
    setMessage(text);
    setHistory((current) => [text, ...current].slice(0, 6));
  };

  const inspectVehicle = () => {
    setStep("scan");
    log(`Visual inspection complete: ${fault.symptom}`);
  };

  const runTest = () => {
    if (step === "inspect") {
      log("Complete the visual inspection before testing.");
      return;
    }
    setTests((current) => current + 1);
    setStep("test");
    if (mode === "practice") {
      log(`Practice reading at ${component}: ${fault.readings[probe]}. Expected ${fault.expected[probe]}.`);
      return;
    }
    if (tool === "scanner") log(`DTC ${fault.code}: ${fault.title}. Confirm the circuit before replacing parts.`);
    else if (tool === "diagram") log(`Diagram trace: follow the ${probe} circuit between the ECU and ${component}.`);
    else log(`${tools[tool]} result at ${component} / ${probe}: ${fault.readings[probe]}. Expected ${fault.expected[probe]}.`);
  };

  const chooseDiagnosis = (value: string) => {
    setDiagnosis(value);
    setStep("diagnose");
    if (value === fault.id) log("Diagnosis correct. You may now apply the repair.");
    else log("Diagnosis does not match the evidence. Test another circuit before repairing.");
  };

  const applyRepair = () => {
    if (mode === "practice") return log("Practice mode has no active fault.");
    if (diagnosis !== fault.id) return log("Select the correct diagnosis before applying a repair.");
    setRepairApplied(true);
    setStep("verify");
    log(`Repair applied. Parts estimate: $${fault.partsCost}. Run a final verification test.`);
  };

  const verifyRepair = () => {
    if (!repairApplied) return log("No repair has been applied yet.");
    const earned = Math.max(100 - tests * 8, 40);
    setScore((current) => current + earned);
    setSolved(true);
    log(`Repair verified. System operating normally. +${earned} XP.`);
  };

  const nextFault = () => {
    setFaultIndex((current) => (current + 1) % visibleFaults.length);
    setStep("inspect"); setTests(0); setSolved(false); setRepairApplied(false); setDiagnosis("");
    log("New vehicle complaint loaded. Start with a visual inspection.");
  };

  return (
    <main className="min-h-screen bg-[#071014] text-white">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 bg-[#101b20] px-5 py-4">
        <div><a href="/" className="text-[10px] uppercase tracking-[0.3em] text-cyan-300">← Back to Cold Start</a><h1 className="mt-2 text-2xl font-black uppercase tracking-[0.14em]">Diagnostics Lab</h1><p className="text-sm text-white/55">A structured inspect, test, diagnose, repair, verify workflow</p></div>
        <div className="flex gap-2 text-center"><div className="rounded-xl border border-amber-300/30 bg-amber-400/10 px-4 py-2"><div className="text-[9px] uppercase tracking-widest text-amber-200/70">XP</div><strong>{score}</strong></div><div className="rounded-xl border border-cyan-300/30 bg-cyan-400/10 px-4 py-2"><div className="text-[9px] uppercase tracking-widest text-cyan-200/70">Tests</div><strong>{tests}</strong></div></div>
      </header>
      <div className="mx-auto grid max-w-[1500px] gap-5 p-5 lg:grid-cols-[245px_1fr_310px]">
        <aside className="space-y-4 rounded-2xl border border-white/10 bg-[#0d1a20] p-4">
          <div><div className="mb-2 text-[10px] uppercase tracking-[0.25em] text-white/45">Mode</div><div className="grid grid-cols-2 gap-2">{(["practice", "challenge"] as const).map((item) => <button key={item} onClick={() => setMode(item)} className={`rounded-lg px-2 py-3 text-[10px] font-bold uppercase tracking-widest ${mode === item ? "bg-cyan-400 text-slate-950" : "bg-white/5 text-white/60"}`}>{item}</button>)}</div></div>
          <div><div className="mb-2 text-[10px] uppercase tracking-[0.25em] text-white/45">Difficulty</div><div className="space-y-2">{(["basic", "advanced", "specialist"] as const).map((item) => <button key={item} onClick={() => { setDifficulty(item); setFaultIndex(0); setStep("inspect"); setSolved(false); }} className={`w-full rounded-lg border px-3 py-2 text-left text-xs uppercase tracking-widest ${difficulty === item ? "border-amber-300 bg-amber-400/10 text-amber-200" : "border-white/10 text-white/55"}`}>{item}</button>)}</div></div>
          <div><div className="mb-2 text-[10px] uppercase tracking-[0.25em] text-white/45">Tools</div><div className="space-y-2">{(Object.keys(tools) as Tool[]).map((item) => <button key={item} onClick={() => setTool(item)} className={`w-full rounded-lg border px-3 py-2 text-left text-xs ${tool === item ? "border-cyan-300 bg-cyan-400/10 text-cyan-200" : "border-white/10 text-white/55"}`}>{tools[item]}</button>)}</div></div>
          <div className="rounded-xl border border-white/10 bg-black/20 p-3"><div className="mb-2 text-[10px] uppercase tracking-widest text-white/40">Workflow</div>{steps.map((item, index) => <div key={item} className={`flex items-center gap-2 py-1 text-xs ${step === item ? "text-cyan-200" : index < steps.indexOf(step) ? "text-emerald-300" : "text-white/35"}`}><span className="h-2 w-2 rounded-full bg-current" />{stepLabels[item]}</div>)}</div>
        </aside>
        <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#16252a] p-5 shadow-2xl"><div className="absolute inset-0 opacity-30" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)", backgroundSize: "42px 42px" }} /><div className="relative"><div className="mb-5 flex flex-wrap items-center justify-between gap-3"><div><p className="text-[10px] uppercase tracking-[0.3em] text-cyan-300">Training vehicle / {fault.difficulty}</p><h2 className="text-xl font-bold">{fault.title}</h2></div><span className={`rounded-full px-3 py-1 text-[10px] uppercase tracking-widest ${solved ? "bg-emerald-400/20 text-emerald-300" : "bg-red-400/15 text-red-200"}`}>{solved ? "Verified" : "Fault active"}</span></div>
          <div className="mb-5 rounded-2xl border border-white/10 bg-[#0a1317]/80 p-5"><div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">{["ECU", "Fuse box", "Sensors", "Actuators"].map((part) => <button key={part} onClick={() => setComponent(part)} className={`rounded-xl border p-4 text-left transition ${component === part ? "border-amber-300 bg-amber-400/10" : "border-white/10 bg-white/[.03] hover:border-white/30"}`}><div className="mb-3 h-10 rounded bg-gradient-to-br from-slate-600 to-slate-900" /><div className="text-xs font-bold">{part}</div><div className="text-[10px] text-white/40">Click to inspect</div></button>)}</div><div className="flex min-h-[150px] items-center justify-center rounded-xl border border-dashed border-cyan-300/30 bg-cyan-400/[.04] text-center"><div><div className="text-5xl">⚙</div><div className="mt-2 text-xs uppercase tracking-widest text-cyan-200">{component}</div><p className="mt-2 max-w-md text-sm text-white/50">{fault.symptom}</p></div></div></div>
          <div className="mb-3 grid gap-3 md:grid-cols-3"><div className="rounded-xl border border-white/10 bg-black/20 p-3"><div className="mb-2 text-[10px] uppercase tracking-widest text-white/40">Probe point</div><div className="flex gap-2">{(["power", "ground", "signal"] as Probe[]).map((item) => <button key={item} onClick={() => setProbe(item)} className={`flex-1 rounded px-2 py-2 text-[10px] uppercase ${probe === item ? "bg-amber-400 text-black" : "bg-white/10 text-white/60"}`}>{item}</button>)}</div></div><button onClick={inspectVehicle} className="rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-xs font-black uppercase tracking-widest hover:bg-white/15">1. Inspect vehicle</button><button onClick={runTest} className="rounded-xl bg-cyan-400 px-4 py-3 text-xs font-black uppercase tracking-widest text-slate-950 hover:bg-cyan-300">2. Run {tools[tool]} test</button></div>
          <div className="grid gap-3 md:grid-cols-2"><div className="rounded-xl border border-white/10 bg-black/20 p-3"><div className="mb-2 text-[10px] uppercase tracking-widest text-white/40">Diagnosis</div><div className="grid gap-2">{visibleFaults.map((item) => <button key={item.id} onClick={() => chooseDiagnosis(item.id)} className={`rounded-lg border px-3 py-2 text-left text-xs ${diagnosis === item.id ? "border-amber-300 bg-amber-400/10" : "border-white/10 text-white/60"}`}>{item.component} — possible fault</button>)}</div></div><div className="flex flex-col gap-3"><button onClick={applyRepair} className="rounded-xl border border-orange-300/40 bg-orange-400/10 px-4 py-3 text-xs font-black uppercase tracking-widest text-orange-200 hover:bg-orange-400/20">3. Apply repair</button><button onClick={verifyRepair} className="rounded-xl border border-emerald-300/40 bg-emerald-400/10 px-4 py-3 text-xs font-black uppercase tracking-widest text-emerald-200 hover:bg-emerald-400/20">4. Verify system</button></div></div>
        </div></section>
        <aside className="space-y-4"><div className="rounded-2xl border border-white/10 bg-[#0d1a20] p-4"><div className="mb-2 text-[10px] uppercase tracking-[0.25em] text-white/45">Live reading</div><div className="rounded-xl bg-black/30 p-4 text-center"><div className="text-3xl font-black text-amber-300">{mode === "practice" ? fault.readings[probe] : step === "test" || step === "diagnose" || step === "repair" || step === "verify" ? fault.readings[probe] : "—"}</div><div className="mt-2 text-[10px] uppercase tracking-widest text-white/40">{probe} / {component}</div></div><p className="mt-3 text-sm leading-6 text-white/60">{message}</p></div><div className="rounded-2xl border border-amber-300/20 bg-amber-400/[.06] p-4"><div className="mb-2 text-[10px] uppercase tracking-[0.25em] text-amber-200/70">Technician hint</div><p className="text-sm leading-6 text-amber-100/75">{fault.hint}</p><div className="mt-3 text-xs text-amber-100/50">Estimated parts: ${fault.partsCost}</div></div><div className="rounded-2xl border border-white/10 bg-[#0d1a20] p-4"><div className="mb-2 text-[10px] uppercase tracking-[0.25em] text-white/45">Activity log</div><div className="space-y-2 text-xs text-white/55">{history.length ? history.map((item, index) => <p key={`${item}-${index}`}>{item}</p>) : <p>No tests recorded yet.</p>}</div></div><button onClick={nextFault} className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-xs font-bold uppercase tracking-widest text-white/75 hover:bg-white/10">Load next fault</button></aside>
      </div>
    </main>
  );
}
