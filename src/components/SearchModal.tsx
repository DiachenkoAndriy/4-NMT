import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, Search, X } from 'lucide-react';
import { Chapter, MonumentAsset, SummaryModule } from '../types/content';
import { SearchResult, searchStudyContent } from '../utils/studyHelpers';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  chapters: Chapter[];
  summary: SummaryModule;
  visuals: MonumentAsset[];
  onSelectResult: (result: SearchResult) => void;
}

const SUGGESTED_QUERIES = [
  'Дорогичин',
  '1253',
  'Калка',
  'Батий',
  'Долинський',
  'Роман Мстиславич',
];

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  chapters,
  summary,
  visuals,
  onSelectResult,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const timer = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 30);
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('keydown', handleKey);
    };
  }, [isOpen, onClose]);

  const results = useMemo(
    () => searchStudyContent(query, chapters, summary, 24, visuals),
    [query, chapters, summary, visuals]
  );

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-start justify-center sm:pt-16 p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Пошук по підручнику, конспекту і картках"
    >
      <button
        type="button"
        aria-label="Закрити пошук"
        onClick={onClose}
        className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs"
      />

      <div className="relative z-10 w-full max-w-2xl rounded-t-2xl sm:rounded-2xl border border-stone-200 dark:border-slate-800 bg-[#F9F8F5] dark:bg-[#14171F] shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
        {/* Search Input Header */}
        <div className="flex items-center gap-3 border-b border-stone-200 dark:border-slate-800 px-4 py-3 bg-white dark:bg-[#0C0E12]">
          <Search className="h-5 w-5 shrink-0 text-stone-400" aria-hidden="true" />
          <label htmlFor="global-study-search" className="sr-only">
            Пошук по підручнику, таблицях, конспекту та картках
          </label>
          <input
            ref={inputRef}
            id="global-study-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Пошук дат, імен, битв, термінів (наприклад: Дорогичин)…"
            className="min-h-[44px] w-full bg-transparent text-[15px] text-stone-950 dark:text-white placeholder:text-stone-400 dark:placeholder:text-slate-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрити вікно пошуку"
            className="inline-flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-lg text-stone-500 hover:bg-stone-100 hover:text-stone-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white cursor-pointer"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Results / Quick Chips */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {query.trim().length < 2 ? (
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-slate-400 mb-3">
                Популярні запити НМТ:
              </div>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_QUERIES.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setQuery(q)}
                    className="inline-flex min-h-[44px] items-center rounded-xl border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2 text-sm font-medium text-stone-800 dark:text-slate-200 hover:border-blue-400 hover:text-blue-800 dark:hover:border-blue-600 dark:hover:text-blue-300 cursor-pointer"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="py-10 text-center text-sm text-stone-600 dark:text-slate-400">
              За запитом «{query}» нічого не знайдено. Спробуйте інше слово або дату.
            </div>
          ) : (
            <div className="space-y-2.5">
              <div className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-slate-400 tabular-nums">
                Знайдено результатів: {results.length}
              </div>
              {results.map((res) => (
                <button
                  key={res.id}
                  type="button"
                  onClick={() => {
                    onSelectResult(res);
                    onClose();
                  }}
                  className="flex w-full items-start justify-between gap-3 rounded-xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-[#0C0E12] p-4 text-left transition-colors hover:border-blue-400 dark:hover:border-blue-700 cursor-pointer"
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-blue-800 dark:text-blue-400 mb-1">
                      {res.categoryLabel}
                    </div>
                    <div className="font-serif text-lg font-bold text-stone-950 dark:text-white leading-snug">
                      {res.title}
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-stone-600 dark:text-slate-300 line-clamp-2">
                      {res.snippet}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-stone-400 mt-1" aria-hidden="true" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
