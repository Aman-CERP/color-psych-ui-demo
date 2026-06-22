import { useState, useCallback } from 'react';
import { FlaskConical, ChevronRight } from 'lucide-react';
import type { PaletteKey } from '../types';
import { palettes, paletteKeys } from '../data';
import { PalettePreview } from './PalettePreview';

interface StudyModeProps {
  shortlist: PaletteKey[];
  onApply: (key: PaletteKey) => void;
}

function randomPair(keys: PaletteKey[]): [PaletteKey, PaletteKey] {
  const pool = keys.length >= 2 ? keys : paletteKeys;
  const a = pool[Math.floor(Math.random() * pool.length)];
  let b = pool[Math.floor(Math.random() * pool.length)];
  while (b === a && pool.length > 1) {
    b = pool[Math.floor(Math.random() * pool.length)];
  }
  return [a, b];
}

export function StudyMode({ shortlist, onApply }: StudyModeProps) {
  const [active, setActive] = useState(false);
  const [round, setRound] = useState(0);
  const [pair, setPair] = useState<[PaletteKey, PaletteKey]>(() => randomPair(shortlist));
  const [choices, setChoices] = useState<PaletteKey[]>([]);
  const maxRounds = 5;

  const startStudy = useCallback(() => {
    setActive(true);
    setRound(1);
    setChoices([]);
    setPair(randomPair(shortlist));
  }, [shortlist]);

  const pickWinner = (winner: PaletteKey) => {
    setChoices((prev) => [...prev, winner]);
    if (round >= maxRounds) {
      setActive(false);
      return;
    }
    setRound((r) => r + 1);
    setPair(randomPair(shortlist));
  };

  if (!active && choices.length === 0) {
    return (
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-2">
          <FlaskConical className="w-5 h-5 accent-text" />
          <h3 className="font-semibold text-lg">Structured Study Mode</h3>
        </div>
        <p className="text-sm text-[var(--text-muted)] mb-4">
          Complete {maxRounds} forced-choice rounds
          {shortlist.length >= 2 ? ' from your shortlist' : ' from all palettes'} to identify your preferred direction.
        </p>
        <button onClick={startStudy} className="btn btn-primary text-sm">
          Start Study Session
        </button>
      </div>
    );
  }

  if (!active && choices.length > 0) {
    const counts = choices.reduce<Record<string, number>>((acc, k) => {
      acc[k] = (acc[k] ?? 0) + 1;
      return acc;
    }, {});
    const winner = Object.entries(counts).sort(([, a], [, b]) => b - a)[0]?.[0] as PaletteKey | undefined;

    return (
      <div className="card p-6">
        <h3 className="font-semibold text-lg mb-2">Study Complete</h3>
        <p className="text-sm text-[var(--text-muted)] mb-4">
          Your top pick: <strong>{winner ? palettes[winner].name : '—'}</strong> ({counts[winner ?? ''] ?? 0}/{maxRounds} choices)
        </p>
        <div className="flex gap-2">
          {winner && (
            <button onClick={() => onApply(winner)} className="btn btn-primary text-sm">
              Apply Winner
            </button>
          )}
          <button onClick={startStudy} className="btn btn-secondary text-sm">
            Run Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg">
          Round {round} of {maxRounds}
        </h3>
        <button onClick={() => setActive(false)} className="text-xs text-[var(--text-muted)] hover:text-[var(--text)]">
          Exit study
        </button>
      </div>
      <p className="text-sm text-[var(--text-muted)] mb-4">Which palette feels more calm and premium for your product?</p>
      <div className="grid md:grid-cols-2 gap-4">
        {pair.map((key) => (
          <button
            key={key}
            onClick={() => pickWinner(key)}
            className="text-left rounded-xl border border-[var(--border)] hover:border-[var(--accent)] p-3 transition-all group"
          >
            <PalettePreview paletteKey={key} mode="light" />
            <div className="mt-2 flex items-center gap-1 text-xs font-medium accent-text opacity-0 group-hover:opacity-100 transition-opacity">
              Choose {palettes[key].name.split(' ')[0]} <ChevronRight className="w-3 h-3" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}