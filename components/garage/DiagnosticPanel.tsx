type DiagnosticPanelProps = {
  title?: string;
  batteryVoltage?: number;
  rpm?: number;
  faultCode?: string;
};

export function DiagnosticPanel({
  title = "OBD Scanner",
  batteryVoltage = 12.4,
  rpm = 760,
  faultCode = "P0562",
}: DiagnosticPanelProps) {
  return (
    <div className="w-[340px] rounded-2xl border border-white/10 bg-slate-900/80 p-4 text-white shadow-2xl">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-[0.3em] text-slate-400">
          {title}
        </span>
        <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-1 text-[9px] uppercase tracking-wide text-emerald-300">
          live
        </span>
      </div>

      <div className="space-y-3">
        <div className="rounded-xl border border-slate-700 bg-slate-800/80 p-3">
          <div className="mb-1 text-[10px] uppercase tracking-[0.2em] text-slate-400">
            Battery
          </div>
          <div className="text-2xl font-bold text-amber-300">{batteryVoltage.toFixed(1)}V</div>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-800/80 p-3">
          <div className="mb-1 text-[10px] uppercase tracking-[0.2em] text-slate-400">
            RPM
          </div>
          <div className="text-2xl font-bold text-cyan-300">{rpm}</div>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-800/80 p-3">
          <div className="mb-1 text-[10px] uppercase tracking-[0.2em] text-slate-400">
            DTC
          </div>
          <div className="text-xl font-bold text-rose-300">{faultCode}</div>
        </div>
      </div>
    </div>
  );
}
