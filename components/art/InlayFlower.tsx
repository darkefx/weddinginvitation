import { stone } from "./palette";

type Props = { className?: string; variant?: "tall" | "small" };

const line = { stroke: stone.gold, strokeWidth: 0.7, strokeLinejoin: "round" as const };

function Bloom({ x, y, rotate = 0, scale = 1, fill = stone.carnelian }: { x: number; y: number; rotate?: number; scale?: number; fill?: string }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
      <path d="M0,0 C-11,-4 -17,-17 -14,-31 C-6,-26 -1,-14 0,0 Z" fill={fill} {...line} />
      <path d="M0,0 C11,-4 17,-17 14,-31 C6,-26 1,-14 0,0 Z" fill={fill} {...line} />
      <path d="M0,-2 C-8,-14 -7,-31 0,-41 C7,-31 8,-14 0,-2 Z" fill={stone.coral} {...line} />
      <path d="M0,-8 V-30" stroke={stone.goldSoft} strokeWidth={0.6} strokeLinecap="round" />
      <path d="M-6,-1 C-3,5 3,5 6,-1 C3,-4 -3,-4 -6,-1 Z" fill={stone.jade} {...line} />
    </g>
  );
}

function Star({ x, y, scale = 1, fill = stone.amber }: { x: number; y: number; scale?: number; fill?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse key={a} cx={0} cy={-8} rx={4.6} ry={6.8} transform={`rotate(${a})`} fill={fill} {...line} />
      ))}
      <circle r={3.2} fill={stone.carnelian} {...line} />
    </g>
  );
}

function Bud({ x, y, rotate = 0, fill = stone.lapis }: { x: number; y: number; rotate?: number; fill?: string }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
      <path d="M0,0 C-6,-6 -5,-15 0,-20 C5,-15 6,-6 0,0 Z" fill={fill} {...line} />
      <path d="M-4,0 C-2,4 2,4 4,0 Z" fill={stone.jade} {...line} />
    </g>
  );
}

function Leaf({ x, y, rotate = 0, scale = 1 }: { x: number; y: number; rotate?: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
      <path d="M0,0 C8,-7 22,-7 31,0 C22,7 8,7 0,0 Z" fill={stone.leaf} {...line} />
      <path d="M3,0 H26" stroke={stone.jadeDeep} strokeOpacity={0.45} strokeWidth={0.6} strokeLinecap="round" />
    </g>
  );
}

const stem = { fill: "none", stroke: stone.jade, strokeWidth: 1.5, strokeLinecap: "round" as const };

function Side() {
  return (
    <g>
      <path d="M80,132 C68,124 54,112 51,94" {...stem} />
      <path d="M80,166 C60,162 36,152 28,131" {...stem} />
      <path d="M80,188 C64,190 46,184 37,170" {...stem} />
      <Leaf x={80} y={150} rotate={-152} scale={0.62} />
      <Leaf x={80} y={110} rotate={-140} scale={0.5} />
      <Leaf x={62} y={160} rotate={-108} scale={0.42} />
      <Leaf x={80} y={210} rotate={-166} scale={1.55} />
      <Leaf x={80} y={208} rotate={-128} scale={0.95} />
      <Bloom x={51} y={96} rotate={-14} scale={0.72} fill={stone.coral} />
      <Star x={26} y={122} />
      <Bud x={37} y={171} rotate={-38} />
    </g>
  );
}

/**
 * A flowering plant in the manner of marble inlay: flat cut "stones" with a
 * fine gold outline, perfectly symmetrical about its stem.
 */
export function InlayFlower({ className, variant = "tall" }: Props) {
  if (variant === "small") {
    return (
      <svg viewBox="40 20 80 110" className={className} aria-hidden="true">
        <path d="M80,128 V72" {...stem} />
        <Leaf x={80} y={120} rotate={-150} scale={0.8} />
        <g transform="translate(160 0) scale(-1 1)">
          <Leaf x={80} y={120} rotate={-150} scale={0.8} />
        </g>
        <Bloom x={80} y={72} scale={1} />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 160 222" className={className} aria-hidden="true">
      <path d="M80,212 C80,170 80,120 80,72" {...stem} />
      <Side />
      <g transform="translate(160 0) scale(-1 1)">
        <Side />
      </g>
      <Bloom x={80} y={72} scale={1.22} />
      <path d="M56,216 C64,207 72,209 80,209 C88,209 96,207 104,216 Z" fill={stone.jade} {...line} />
    </svg>
  );
}
