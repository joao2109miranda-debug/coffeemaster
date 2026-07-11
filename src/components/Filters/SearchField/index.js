const SearchField = ({ value, onChange, placeholder }) => (
  <div className="search-field">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
    {value ? (
      <button type="button" className="search-clear" onClick={() => onChange("")} aria-label="Limpar busca">
        ×
      </button>
    ) : null}
  </div>
);

export default SearchField;
