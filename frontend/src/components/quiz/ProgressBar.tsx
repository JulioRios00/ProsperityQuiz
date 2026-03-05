interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const pct = Math.round((current / total) * 100);

  return (
    <div className="w-full px-4 pt-4 pb-2">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>Passo {current} de {total}</span>
          <span>{pct}%</span>
        </div>
        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-gold-400 to-gold-500 rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}
