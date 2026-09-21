type PaintBoothProps = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  open?: boolean;
};

export function PaintBooth({
  x = 0,
  y = 0,
  width = 560,
  height = 260,
  open = false,
}: PaintBoothProps) {
  return (
    <div
      className="pointer-events-none absolute"
      style={{
        left: x,
        top: y,
        width,
        height,
      }}
    >
      <svg viewBox="0 0 560 260" width="100%" height="100%">
        <rect
          x="18"
          y="26"
          width="524"
          height="200"
          rx="10"
          fill="rgba(245,247,250,0.32)"
          stroke="rgba(255,255,255,0.5)"
          strokeWidth="2"
        />

        <rect
          x="40"
          y="52"
          width="500"
          height="150"
          rx="8"
          fill="rgba(255,255,255,0.06)"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="2"
        />

        <line x1="80" x2="80" y1="42" y2="204" stroke="rgba(255,255,255,0.18)" strokeWidth="2" />
        <line x1="150" x2="150" y1="42" y2="204" stroke="rgba(255,255,255,0.18)" strokeWidth="2" />
        <line x1="220" x2="220" y1="42" y2="204" stroke="rgba(255,255,255,0.18)" strokeWidth="2" />
        <line x1="290" x2="290" y1="42" y2="204" stroke="rgba(255,255,255,0.18)" strokeWidth="2" />
        <line x1="360" x2="360" y1="42" y2="204" stroke="rgba(255,255,255,0.18)" strokeWidth="2" />
        <line x1="430" x2="430" y1="42" y2="204" stroke="rgba(255,255,255,0.18)" strokeWidth="2" />

        <path
          d="M88 180 H470"
          stroke="rgba(255,255,255,0.18)"
          strokeWidth="2"
          strokeDasharray="10 10"
        />

        <path
          d={open ? "M185 28 L280 28 L280 52" : "M20 28 L185 28"}
          stroke="rgba(255,255,255,0.32)"
          strokeWidth="3"
          fill="none"
        />

        <path
          d={open ? "M375 28 L525 28 L525 52" : "M375 28 L540 28"}
          stroke="rgba(255,255,255,0.32)"
          strokeWidth="3"
          fill="none"
        />
      </svg>
    </div>
  );
}
