const Rating = ({ value = 0, count = 0, size = 'sm' }) => {
  const stars = Array.from({ length: 5 }, (_, i) => {
    if (i < Math.floor(value)) return 'full';
    if (i < Math.ceil(value) && value % 1 >= 0.5) return 'half';
    return 'empty';
  });

  const sizeClass = size === 'lg' ? 'text-xl' : 'text-sm';

  return (
    <div className="flex items-center gap-1.5">
      <div className={`flex ${sizeClass}`}>
        {stars.map((star, i) => (
          <span
            key={i}
            className={
              star === 'empty' ? 'text-[var(--text-muted)]/30' : 'text-[var(--warning)]'
            }
          >
            ★
          </span>
        ))}
      </div>
      <span className={`text-[var(--text-muted)] ${size === 'lg' ? 'text-sm' : 'text-xs'}`}>
        {value > 0 ? value.toFixed(1) : 'N/A'} ({count} avis)
      </span>
    </div>
  );
};

export default Rating;