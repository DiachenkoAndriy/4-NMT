import React, { useEffect } from 'react';
import { ArrowUpRight, X } from 'lucide-react';
import { MonumentAsset } from '../types/content';

interface MonumentModalProps {
  monument: MonumentAsset | null;
  onClose: () => void;
  onJumpToChapter?: (chapterId: string) => void;
}

export const MonumentModal: React.FC<MonumentModalProps> = ({
  monument,
  onClose,
  onJumpToChapter,
}) => {
  useEffect(() => {
    if (!monument) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [monument, onClose]);

  if (!monument) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={monument.title}
    >
      <button
        type="button"
        aria-label="Закрити перегляд візуального джерела"
        onClick={onClose}
        className="fixed inset-0 bg-stone-950/70 backdrop-blur-xs"
      />

      <div className="relative z-10 w-full max-w-4xl rounded-t-2xl sm:rounded-2xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-[#14171F] shadow-2xl max-h-[92vh] overflow-y-auto">
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-stone-200 dark:border-slate-800 bg-white/95 dark:bg-[#14171F]/95 backdrop-blur-md px-5 py-3.5">
          <div className="min-w-0">
            <div className="text-xs font-mono text-stone-500 dark:text-slate-400">
              {monument.orderNumber ? `Джерело ${monument.orderNumber} · ` : ''}
              {monument.date} · {monument.locationAndAuthor}
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-950 dark:text-white leading-snug">
              {monument.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрити вікно перегляду"
            className="inline-flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-xl border border-stone-200 dark:border-slate-700 text-stone-700 dark:text-slate-200 hover:bg-stone-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="p-5 sm:p-7 space-y-5">
          <div className="rounded-xl border border-stone-200 dark:border-slate-800 bg-stone-100 dark:bg-slate-900 p-3 sm:p-4 flex items-center justify-center">
            <img
              src={monument.imagePath}
              alt={monument.title}
              className="max-h-[58vh] w-auto object-contain rounded-lg"
            />
          </div>

          <div className="space-y-3 text-[15px] leading-relaxed text-stone-800 dark:text-slate-200">
            <p>
              <strong className="font-semibold text-stone-950 dark:text-white">
                Опис джерела:{' '}
              </strong>
              {monument.visualFeature}
            </p>
            <p>
              <strong className="font-semibold text-blue-800 dark:text-blue-400">
                Головний маркер для НМТ:{' '}
              </strong>
              {monument.markerDetail.replace(/^Маркер:\s*/i, '')}
            </p>
            <div className="rounded-xl border border-amber-300/90 dark:border-amber-700/60 bg-amber-50/70 dark:bg-amber-950/20 p-4 text-sm text-amber-900 dark:text-amber-200">
              <strong className="font-semibold">Типова пастка НМТ: </strong>
              {monument.trapDetail.replace(/^Пастка:\s*/i, '')}
            </div>

            {monument.relatedChapterId && onJumpToChapter && (
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    onJumpToChapter(monument.relatedChapterId!);
                    onClose();
                  }}
                  className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl bg-blue-800 dark:bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-900 dark:hover:bg-blue-500 cursor-pointer"
                >
                  <span>Перейти до відповідного розділу підручника</span>
                  <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
