import SearchField from "../SearchField";
import SegmentedControl from "../SegmentedControl";

// Barra de filtros padrão da aplicação.
// props:
//   search: { value, onChange, placeholder }        -> campo de busca (opcional)
//   inlineFilter: { label?, options, value, onChange } -> toggle ao lado da busca (ex.: ordenação)
//   groups: [{ label, options, value, onChange }]    -> grupos de filtro abaixo
//   meta: string                                     -> texto de resultado (ex.: "8 itens")
const FilterToolbar = ({ search, inlineFilter, groups = [], meta }) => (
  <div className="toolbar">
    {(search || inlineFilter) && (
      <div className="toolbar-top">
        {search ? <SearchField {...search} /> : null}
        {inlineFilter ? <SegmentedControl inline {...inlineFilter} /> : null}
      </div>
    )}

    {groups.length > 0 && (
      <div className="toolbar-filters">
        {groups.map((g, i) => (
          <SegmentedControl key={g.label || i} {...g} />
        ))}
      </div>
    )}

    {meta ? <div className="results-meta">{meta}</div> : null}
  </div>
);

export default FilterToolbar;
