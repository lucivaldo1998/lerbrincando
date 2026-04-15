export function Progress({ value, label }: { value: number; label?: string }) {
  return (
    <div className="mb-5">
      {label ? <p className="mb-1.5 text-xs font-bold uppercase tracking-wider text-brand-700">{label}</p> : null}
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${Math.max(2, Math.min(100, value))}%` }} />
      </div>
      <p className="mt-1 text-right text-xs font-semibold text-brand-700">{Math.round(value)}% concluído</p>
    </div>
  );
}
