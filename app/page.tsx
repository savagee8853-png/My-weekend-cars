import { GarageSceneDemo } from "@/components/garage/GarageSceneDemo";

export default function Page() {
  return (
    <>
      <a
        href="/diagnostics"
        className="fixed right-4 top-4 z-[100] rounded-full border border-cyan-300/40 bg-slate-950/90 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-200 shadow-xl backdrop-blur transition hover:border-cyan-200 hover:bg-cyan-500/20"
      >
        Open Diagnostics Lab
      </a>
      <GarageSceneDemo />
    </>
  );
}
