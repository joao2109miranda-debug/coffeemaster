const Skeleton = ({ variant = 'row', count = 3 }) => <div className={`skeleton-list skeleton-list--${variant}`}>{Array.from({ length: count }, (_, index) => <div className="skeleton" key={index}><span /><span /><span /></div>)}</div>;
export default Skeleton;
