import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  RotateCcw,
  Shuffle,
  Trash2,
} from 'lucide-react';
import { Chapter, FlashcardItem } from '../types/content';
import { filterFlashcards } from '../utils/studyHelpers';

interface FlashcardsViewProps {
  chapters: Chapter[];
  allCards: FlashcardItem[];
  masteredIds: Set<string>;
  onToggleMastered: (cardId: string) => void;
  onResetProgress: () => void;
  initialFocusCardId?: string | null;
}

export const FlashcardsView: React.FC<FlashcardsViewProps> = ({
  chapters,
  allCards,
  masteredIds,
  onToggleMastered,
  onResetProgress,
  initialFocusCardId,
}) => {
  const [chapterFilter, setChapterFilter] = useState<string>('all');
  const [onlyUnmastered, setOnlyUnmastered] = useState<boolean>(false);
  const [shuffledOrder, setShuffledOrder] = useState<string[] | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [confirmReset, setConfirmReset] = useState<boolean>(false);

  const filteredCards = useMemo(() => {
    const base = filterFlashcards(allCards, chapterFilter, onlyUnmastered, masteredIds);
    if (!shuffledOrder) return base;
    const rank = new Map(shuffledOrder.map((id, idx) => [id, idx]));
    return [...base].sort((a, b) => (rank.get(a.id) ?? 0) - (rank.get(b.id) ?? 0));
  }, [allCards, chapterFilter, onlyUnmastered, masteredIds, shuffledOrder]);

  useEffect(() => {
    if (!initialFocusCardId) return;
    const target = allCards.find((c) => c.id === initialFocusCardId);
    if (target) {
      setChapterFilter(target.chapterId);
      setOnlyUnmastered(false);
      setShuffledOrder(null);
      const chapterCards = allCards.filter((c) => c.chapterId === target.chapterId);
      const idx = chapterCards.findIndex((c) => c.id === initialFocusCardId);
      if (idx >= 0) {
        setCurrentIndex(idx);
        setIsFlipped(false);
      }
    }
  }, [initialFocusCardId, allCards]);

  useEffect(() => {
    if (currentIndex >= filteredCards.length && filteredCards.length > 0) {
      setCurrentIndex(filteredCards.length - 1);
    }
  }, [filteredCards.length, currentIndex]);

  const currentCard = filteredCards[currentIndex] ?? null;

  const goPrev = () => {
    if (filteredCards.length === 0) return;
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : filteredCards.length - 1));
  };

  const goNext = () => {
    if (filteredCards.length === 0) return;
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev < filteredCards.length - 1 ? prev + 1 : 0));
  };

  const handleShuffle = () => {
    const ids = filteredCards.map((c) => c.id);
    for (let i = ids.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [ids[i], ids[j]] = [ids[j], ids[i]];
    }
    setShuffledOrder(ids);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goNext();
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  });

  const masteredPercent =
    allCards.length > 0 ? Math.round((masteredIds.size / allCards.length) * 100) : 0;

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* Header & Overall Progress */}
      <header className="mb-6 rounded-2xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-[#14171F] p-5 sm:p-8 shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-blue-800 dark:text-blue-400 mb-2">
              Інтерактивна перевірка знань
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-stone-950 dark:text-white">
              Тренажер НМТ: 100 флеш-карток
            </h1>
            <p className="mt-2 text-sm sm:text-[15px] text-stone-600 dark:text-slate-400">
              10 розділів × 10 контрольних запитань із повними розгорнутими відповідями без скорочень.
            </p>
          </div>

          <div className="shrink-0 text-left sm:text-right">
            <div className="font-mono text-2xl font-bold text-stone-950 dark:text-white tabular-nums">
              {masteredIds.size} / {allCards.length}
            </div>
            <div className="text-xs text-stone-500 dark:text-slate-400 tabular-nums">
              Опановано ({masteredPercent}%)
            </div>
          </div>
        </div>

        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-stone-200 dark:bg-slate-800">
          <div
            className="h-full rounded-full bg-emerald-600 dark:bg-emerald-500 transition-all duration-300"
            style={{ width: `${masteredPercent}%` }}
          />
        </div>

        {/* Chapter Filter Strip */}
        <div className="mt-6 pt-5 border-t border-stone-200 dark:border-slate-800 space-y-4">
          <div className="flex overflow-x-auto no-scrollbar gap-2 pb-1">
            <button
              type="button"
              onClick={() => {
                setChapterFilter('all');
                setCurrentIndex(0);
                setIsFlipped(false);
              }}
              className={`inline-flex min-h-[44px] shrink-0 items-center rounded-xl border px-3.5 py-2 text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                chapterFilter === 'all'
                  ? 'border-blue-800 bg-blue-800 text-white dark:border-blue-600 dark:bg-blue-600'
                  : 'border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-900 text-stone-800 dark:text-slate-200 hover:bg-stone-100 dark:hover:bg-slate-800'
              }`}
            >
              Усі картки ({allCards.length})
            </button>
            {chapters.map((ch) => (
              <button
                key={ch.id}
                type="button"
                onClick={() => {
                  setChapterFilter(ch.id);
                  setCurrentIndex(0);
                  setIsFlipped(false);
                }}
                className={`inline-flex min-h-[44px] shrink-0 items-center rounded-xl border px-3.5 py-2 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  chapterFilter === ch.id
                    ? 'border-blue-800 bg-blue-800 text-white dark:border-blue-600 dark:bg-blue-600'
                    : 'border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-900 text-stone-800 dark:text-slate-200 hover:bg-stone-100 dark:hover:bg-slate-800'
                }`}
              >
                Розділ {ch.number}
              </button>
            ))}
          </div>

          {/* Controls Row */}
          <div className="flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setOnlyUnmastered((v) => !v);
                  setCurrentIndex(0);
                  setIsFlipped(false);
                }}
                aria-pressed={onlyUnmastered}
                className={`inline-flex min-h-[44px] items-center gap-2 rounded-xl border px-3.5 py-2 text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                  onlyUnmastered
                    ? 'border-amber-600 bg-amber-50 text-amber-900 dark:border-amber-500 dark:bg-amber-950/40 dark:text-amber-200'
                    : 'border-stone-200 dark:border-slate-700 bg-white dark:bg-[#14171F] text-stone-700 dark:text-slate-300 hover:bg-stone-50 dark:hover:bg-slate-800'
                }`}
              >
                <span>Лише невивчені</span>
              </button>

              <button
                type="button"
                onClick={handleShuffle}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-stone-200 dark:border-slate-700 bg-white dark:bg-[#14171F] px-3.5 py-2 text-xs sm:text-sm font-semibold text-stone-700 dark:text-slate-300 transition-colors hover:bg-stone-50 dark:hover:bg-slate-800 cursor-pointer"
              >
                <Shuffle className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>Перемішати</span>
              </button>

              {shuffledOrder && (
                <button
                  type="button"
                  onClick={() => {
                    setShuffledOrder(null);
                    setCurrentIndex(0);
                    setIsFlipped(false);
                  }}
                  className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-stone-200 dark:border-slate-700 px-3 py-2 text-xs font-medium text-stone-600 dark:text-slate-400 hover:text-stone-900 dark:hover:text-white cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>За порядком</span>
                </button>
              )}
            </div>

            {masteredIds.size > 0 && (
              <div>
                {confirmReset ? (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        onResetProgress();
                        setConfirmReset(false);
                        setCurrentIndex(0);
                      }}
                      className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl bg-rose-700 px-3.5 py-2 text-xs font-semibold text-white hover:bg-rose-800 cursor-pointer"
                    >
                      <span>Підтвердити скидання</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmReset(false)}
                      className="inline-flex min-h-[44px] items-center rounded-xl border border-stone-200 dark:border-slate-700 px-3 py-2 text-xs font-medium text-stone-700 dark:text-slate-300 cursor-pointer"
                    >
                      Скасувати
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmReset(true)}
                    className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-stone-200 dark:border-slate-700 px-3 py-2 text-xs font-medium text-stone-600 dark:text-slate-400 hover:text-rose-700 dark:hover:text-rose-400 cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Скинути прогрес</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Active Flashcard Stage */}
      {currentCard ? (
        <main className="space-y-5">
          <div className="rounded-2xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-[#14171F] p-5 sm:p-8 lg:p-10 shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-6 border-b border-stone-200/80 dark:border-slate-800/80">
              <div className="text-xs font-mono text-stone-500 dark:text-slate-400 tabular-nums">
                Картка {currentIndex + 1} з {filteredCards.length} · {currentCard.chapterTitle} (№{currentCard.number})
              </div>
              {masteredIds.has(currentCard.id) && (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>Вивчено</span>
                </span>
              )}
            </div>

            <div className="min-h-[180px] sm:min-h-[210px] flex flex-col justify-center">
              <div className="text-xs font-semibold uppercase tracking-wider text-blue-800 dark:text-blue-400 mb-3">
                Запитання
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold leading-snug text-stone-950 dark:text-white break-words">
                {currentCard.question}
              </h2>

              {isFlipped && (
                <div className="mt-6 pt-6 border-t border-stone-200 dark:border-slate-800">
                  <div className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-2">
                    Правильна відповідь
                  </div>
                  <p className="text-base sm:text-[17px] leading-[1.72] text-stone-800 dark:text-slate-200 break-words">
                    {currentCard.answer}
                  </p>
                </div>
              )}
            </div>

            {/* Primary Card Actions */}
            <div className="mt-8 pt-6 border-t border-stone-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setIsFlipped((v) => !v)}
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-blue-800 dark:bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-900 dark:hover:bg-blue-500 cursor-pointer"
              >
                <Eye className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{isFlipped ? 'Сховати відповідь' : 'Показати відповідь'}</span>
              </button>

              <div className="flex flex-col sm:flex-row gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    onToggleMastered(currentCard.id);
                  }}
                  className={`inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition-colors cursor-pointer ${
                    masteredIds.has(currentCard.id)
                      ? 'border-emerald-600 bg-emerald-700 text-white dark:border-emerald-500 dark:bg-emerald-600'
                      : 'border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-900 text-stone-800 dark:text-slate-200 hover:bg-stone-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>
                    {masteredIds.has(currentCard.id) ? 'Вивчено (зняти)' : 'Позначити вивченою'}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Prev / Next Navigation */}
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={goPrev}
              className="inline-flex min-h-[48px] flex-1 sm:flex-initial items-center justify-center gap-2 rounded-xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-[#14171F] px-5 py-3 text-sm font-semibold text-stone-800 dark:text-slate-200 hover:bg-stone-50 dark:hover:bg-slate-800 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>Попередня</span>
            </button>

            <span className="hidden sm:inline text-xs text-stone-500 dark:text-slate-400">
              Підказка: Пробіл — відповідь, стрілки ← → — навігація
            </span>

            <button
              type="button"
              onClick={goNext}
              className="inline-flex min-h-[48px] flex-1 sm:flex-initial items-center justify-center gap-2 rounded-xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-[#14171F] px-5 py-3 text-sm font-semibold text-stone-800 dark:text-slate-200 hover:bg-stone-50 dark:hover:bg-slate-800 cursor-pointer"
            >
              <span>Наступна</span>
              <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
            </button>
          </div>
        </main>
      ) : (
        <div className="rounded-2xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-[#14171F] p-8 text-center">
          <h2 className="font-serif text-2xl font-bold text-stone-950 dark:text-white">
            Усі картки цього фільтра вже вивчено
          </h2>
          <p className="mt-2 text-sm text-stone-600 dark:text-slate-400">
            Вимкніть фільтр «Лише невивчені» або оберіть інший розділ, щоб повторити матеріал.
          </p>
          <button
            type="button"
            onClick={() => setOnlyUnmastered(false)}
            className="mt-5 inline-flex min-h-[44px] items-center justify-center rounded-xl bg-blue-800 dark:bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-900 dark:hover:bg-blue-500 cursor-pointer"
          >
            Показати всі картки
          </button>
        </div>
      )}
    </div>
  );
};
