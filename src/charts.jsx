export function BarChart({ values, labels }) {
  const W = 320, H = 150, L = 28, B = 20, T = 8
  const max = Math.max(10, Math.ceil(Math.max(...values) / 10) * 10)
  const bw = (W - L) / values.length
  const y = (v) => T + (H - T - B) * (1 - v / max)
  const ticks = [0, 1, 2, 3, 4].map((i) => Math.round((max * i) / 4))
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="chart">
      {ticks.map((t) => (
        <g key={t}>
          <line x1={L} x2={W} y1={y(t)} y2={y(t)} stroke="#e4eaf5" strokeWidth="1" />
          <text x={L - 6} y={y(t) + 3} fontSize="9" textAnchor="end" fill="#6b7a99">{t}</text>
        </g>
      ))}
      {values.map((v, i) => (
        <g key={i}>
          <rect x={L + i * bw + bw * 0.2} y={y(v)} width={bw * 0.6} height={H - B - y(v)} rx="2" fill="#1570ef" />
          <text x={L + i * bw + bw / 2} y={H - 6} fontSize="9" textAnchor="middle" fill="#6b7a99">{labels[i]}</text>
        </g>
      ))}
    </svg>
  )
}

export function LineChart({ values, labels }) {
  const W = 320, H = 150, L = 28, B = 20, T = 10
  const max = Math.max(10, Math.ceil(Math.max(...values) / 10) * 10)
  const step = (W - L - 10) / (values.length - 1 || 1)
  const x = (i) => L + 4 + i * step
  const y = (v) => T + (H - T - B) * (1 - v / max)
  const pts = values.map((v, i) => `${x(i)},${y(v)}`).join(' ')
  const area = `${x(0)},${H - B} ${pts} ${x(values.length - 1)},${H - B}`
  const ticks = [0, 1, 2, 3, 4].map((i) => Math.round((max * i) / 4))
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="chart">
      {ticks.map((t) => (
        <g key={t}>
          <line x1={L} x2={W} y1={y(t)} y2={y(t)} stroke="#e4eaf5" strokeWidth="1" />
          <text x={L - 6} y={y(t) + 3} fontSize="9" textAnchor="end" fill="#6b7a99">{t}</text>
        </g>
      ))}
      <polygon points={area} fill="#1570ef" opacity="0.1" />
      <polyline points={pts} fill="none" stroke="#1570ef" strokeWidth="2" strokeLinejoin="round" />
      {values.map((v, i) => (
        <g key={i}>
          <circle cx={x(i)} cy={y(v)} r="3" fill="#fff" stroke="#1570ef" strokeWidth="2" />
          <text x={x(i)} y={H - 6} fontSize="9" textAnchor="middle" fill="#6b7a99">{labels[i]}</text>
        </g>
      ))}
    </svg>
  )
}

export function Donut({ slices, size = 130, thickness = 24 }) {
  const r = (size - thickness) / 2
  const c = 2 * Math.PI * r
  const total = slices.reduce((s, x) => s + x.value, 0) || 1
  let acc = 0
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#eef2fa" strokeWidth={thickness} />
      {slices.map((s, i) => {
        const len = (s.value / total) * c
        const el = (
          <circle
            key={i}
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={s.color}
            strokeWidth={thickness}
            strokeDasharray={`${len} ${c - len}`}
            strokeDashoffset={-acc}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        )
        acc += len
        return el
      })}
    </svg>
  )
}
