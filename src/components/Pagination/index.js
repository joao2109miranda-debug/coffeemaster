const Pagination = ({ page, totalPages, onChange }) => {
  const pages = Array.from({ length: Math.max(1, totalPages) }, (_, index) => index + 1);
  const disabled = totalPages <= 1;
  return <nav className="pagination" aria-label="Paginação">
    <button type="button" disabled={page <= 1} onClick={() => onChange(page - 1)}>← Anterior</button>
    {pages.map((item) => <button type="button" key={item} disabled={disabled} className={item === page ? 'active' : ''} onClick={() => onChange(item)}>{item}</button>)}
    <button type="button" disabled={page >= totalPages} onClick={() => onChange(page + 1)}>Próxima →</button>
  </nav>;
};
export default Pagination;
