// Gráfico ilustrativo do design (não são dados reais). Curva fixa do design.
const AREA_PATH =
  "M46.0,43.5 L55.7,44.7 L65.3,46.0 L75.0,47.4 L84.7,48.9 L94.3,50.6 L104.0,52.4 L113.7,54.5 L123.3,56.6 L133.0,59.0 L142.7,61.6 L152.3,64.3 L162.0,67.3 L171.7,70.6 L181.3,74.0 L191.0,77.7 L200.7,81.6 L210.3,85.8 L220.0,90.1 L229.7,94.8 L239.3,99.6 L249.0,104.6 L258.7,109.9 L268.3,115.3 L278.0,120.8 L287.7,126.5 L297.3,132.3 L307.0,138.1 L316.7,144.0 L326.3,149.9 L336.0,155.7 L345.7,161.5 L355.3,167.2 L365.0,172.7 L374.7,178.1 L384.3,183.4 L394.0,188.4 L403.7,193.2 L413.3,197.9 L423.0,202.2 L432.7,206.4 L442.3,210.3 L452.0,214.0 L461.7,217.4 L471.3,220.7 L481.0,223.7 L490.7,226.4 L500.3,229.0 L510.0,231.4 L519.7,233.5 L529.3,235.6 L539.0,237.4 L548.7,239.1 L558.3,240.6 L568.0,242.0 L577.7,243.3 L587.3,244.5 L597.0,245.5 L606.7,246.5 L616.3,247.4 L626.0,248.2 L626,330 L46,330 Z";
const LINE_PATH =
  "M46.0,43.5 L55.7,44.7 L65.3,46.0 L75.0,47.4 L84.7,48.9 L94.3,50.6 L104.0,52.4 L113.7,54.5 L123.3,56.6 L133.0,59.0 L142.7,61.6 L152.3,64.3 L162.0,67.3 L171.7,70.6 L181.3,74.0 L191.0,77.7 L200.7,81.6 L210.3,85.8 L220.0,90.1 L229.7,94.8 L239.3,99.6 L249.0,104.6 L258.7,109.9 L268.3,115.3 L278.0,120.8 L287.7,126.5 L297.3,132.3 L307.0,138.1 L316.7,144.0 L326.3,149.9 L336.0,155.7 L345.7,161.5 L355.3,167.2 L365.0,172.7 L374.7,178.1 L384.3,183.4 L394.0,188.4 L403.7,193.2 L413.3,197.9 L423.0,202.2 L432.7,206.4 L442.3,210.3 L452.0,214.0 L461.7,217.4 L471.3,220.7 L481.0,223.7 L490.7,226.4 L500.3,229.0 L510.0,231.4 L519.7,233.5 L529.3,235.6 L539.0,237.4 L548.7,239.1 L558.3,240.6 L568.0,242.0 L577.7,243.3 L587.3,244.5 L597.0,245.5 L606.7,246.5 L616.3,247.4 L626.0,248.2";

const X_TICKS = [
  { x: 46, label: "20" },
  { x: 143, label: "30" },
  { x: 239, label: "40" },
  { x: 336, label: "50" },
  { x: 433, label: "60" },
  { x: 529, label: "70" },
  { x: 626, label: "80" },
];

export function NadDeclineChart() {
  return (
    <svg
      viewBox="0 0 640 380"
      width="100%"
      aria-hidden="true"
      focusable="false"
      className="block"
    >
      <defs>
        <linearGradient id="nad-area" x1="0" y1="0" x2="0" y2="1">
          <stop
            offset="0"
            style={{ stopColor: "var(--accent)" }}
            stopOpacity={0.45}
          />
          <stop
            offset="1"
            style={{ stopColor: "var(--accent)" }}
            stopOpacity={0}
          />
        </linearGradient>
      </defs>
      <line
        x1="46"
        y1="330"
        x2="626"
        y2="330"
        style={{ stroke: "var(--fg)" }}
        strokeOpacity={0.35}
      />
      <line
        x1="46"
        y1="20"
        x2="46"
        y2="330"
        style={{ stroke: "var(--fg)" }}
        strokeOpacity={0.35}
      />
      <path d={AREA_PATH} fill="url(#nad-area)" />
      <path
        d={LINE_PATH}
        fill="none"
        strokeWidth={3.5}
        strokeLinecap="round"
        style={{ stroke: "var(--accent)" }}
      />
      {X_TICKS.map((tick) => (
        <text
          key={tick.label}
          x={tick.x}
          y={352}
          fontSize={13}
          textAnchor="middle"
          style={{ fill: "var(--fg)", fontFamily: "var(--font-dm-sans)" }}
          opacity={0.7}
        >
          {tick.label}
        </text>
      ))}
      <text
        x={336}
        y={378}
        fontSize={13}
        fontWeight={700}
        textAnchor="middle"
        style={{ fill: "var(--fg)", fontFamily: "var(--font-dm-sans)" }}
        opacity={0.8}
      >
        AGE (YEARS)
      </text>
      <text
        transform="translate(14 175) rotate(-90)"
        fontSize={13}
        fontWeight={700}
        textAnchor="middle"
        style={{ fill: "var(--fg)", fontFamily: "var(--font-dm-sans)" }}
        opacity={0.8}
      >
        NAD+ LEVEL
      </text>
    </svg>
  );
}
