export default function Spinner({ className = 'h-8 w-8' }) {
  return (
    <div className={`animate-spin rounded-full border-2 border-slate-200 border-t-slate-700 ${className}`} />
  );
}
