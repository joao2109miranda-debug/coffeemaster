// Controle segmentado reutilizável (toggle premium).
// options: [{ key, label, count? }] · value · onChange(key) · label? · inline?
const SegmentedControl = ({ options, value, onChange, label, inline = false }) => (
  <div className={`seg-group ${inline ? "inline" : ""}`}>
    {label ? <span className="seg-label">{label}</span> : null}
    <div className="seg" role="tablist" aria-label={label || "Filtro"}>
      {options.map((opt) => (
        <button
          key={opt.key}
          type="button"
          role="tab"
          aria-selected={value === opt.key}
          className={`seg-item ${value === opt.key ? "active" : ""}`}
          onClick={() => onChange(opt.key)}
        >
          <span>{opt.label}</span>
          {opt.count != null ? <span className="seg-count">{opt.count}</span> : null}
        </button>
      ))}
    </div>
  </div>
);

export default SegmentedControl;
