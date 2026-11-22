import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpenCheck,
  CheckCircle2,
  Circle,
  Eye,
  EyeOff,
  FileText,
  Image,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import {
  AppView,
  Chapter,
  FlashcardItem,
  MonumentAsset,
} from '../types/content';
import { ContentBlocksRenderer, RichTextSpan } from './RichTextRenderer';

interface TextbookViewProps {
  chapters: Chapter[];
  activeChapterId: string;
  onSelectChapter: (chapterId: string) => void;
  readerMode: 'chapter' | 'full';
  onChangeReaderMode: (mode: 'chapter' | 'full') => void;
  readChapterIds: Set<string>;
  onToggleReadChapter: (chapterId: string) => void;
  masteredIds: Set<string>;
  onToggleMasteredCard: (cardId: string) => void;
  monuments: MonumentAsset[];
  onSelectMonument: (monument: MonumentAsset) => void;
  onSelectView: (view: AppView) => void;
  onJumpToAnchor: (anchorId: string) => void;
}

const InlineChapterFlashcards: React.FC<{
  flashcards: FlashcardItem[];
  masteredIds: Set<string>;
  onToggleMasteredCard: (id: string) => void;
}> = ({ flashcards, masteredIds, onToggleMasteredCard }) => {
  const [revealedIds, setRevealedIds] = useState<Set<string>>(() => new Set());

  const toggleReveal = (id: string) => {
    setRevealedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const revealAll = () => {
    setRevealedIds(new Set(flashcards.map((f) => f.id)));
  };

  const hideAll = () => {
    setRevealedIds(new Set());
  };

  const chapterMasteredCount = flashcards.filter((f) => masteredIds.has(f.id)).length;

  return (
    <section
      aria-label="Флеш-картки для самоперевірки"
      className="mt-10 rounded-2xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-[#14171F] p-5 sm:p-8 shadow-[0_2px_10px_rgb(0,0,0,0.02)]"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-stone-200 dark:border-slate-800">
        <div>
          <h3 className="font-serif text-2xl sm:text-[26px] font-bold tracking-tight text-stone-950 dark:text-white">
            Флеш-картки для самоперевірки
          </h3>
          <p className="mt-1 text-sm text-stone-600 dark:text-slate-400 tabular-nums">
            Опановано: {chapterMasteredCount} з {flashcards.length} запитань цього розділу
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={revealAll}
            className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-900 px-3.5 py-2 text-xs font-semibold text-stone-800 dark:text-slate-200 transition-colors hover:bg-stone-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <Eye className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>Показати всі відповіді</span>
          </button>
          <button
            type="button"
            onClick={hideAll}
            className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-900 px-3.5 py-2 text-xs font-semibold text-stone-800 dark:text-slate-200 transition-colors hover:bg-stone-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <EyeOff className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>Сховати всі</span>
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3.5">
        {flashcards.map((fc) => {
          const isRevealed = revealedIds.has(fc.id);
          const isMastered = masteredIds.has(fc.id);

          return (
            <div
              key={fc.id}
              className={`rounded-xl border p-4 sm:p-5 transition-colors ${
                isMastered
                  ? 'border-emerald-300/90 dark:border-emerald-800/70 bg-emerald-50/40 dark:bg-emerald-950/15'
                  : 'border-stone-200 dark:border-slate-800 bg-stone-50/60 dark:bg-slate-900/40'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-mono font-semibold text-blue-800 dark:text-blue-400 tabular-nums mb-1">
                    Картка {fc.number}
                  </div>
                  <p className="text-[15.5px] sm:text-base font-semibold leading-snug text-stone-950 dark:text-white break-words">
                    {fc.question}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onToggleMasteredCard(fc.id)}
                  aria-label={isMastered ? 'Зняти позначку вивчено' : 'Позначити картку як вивчену'}
                  className={`inline-flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                    isMastered
                      ? 'border-emerald-600 bg-emerald-700 text-white dark:border-emerald-500 dark:bg-emerald-600'
                      : 'border-stone-200 dark:border-slate-700 bg-white dark:bg-[#14171F] text-stone-700 dark:text-slate-300 hover:border-stone-300 dark:hover:border-slate-600'
                  }`}
                >
                  {isMastered ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                      <span className="hidden sm:inline">Вивчено</span>
                    </>
                  ) : (
                    <>
                      <Circle className="h-4 w-4 shrink-0" aria-hidden="true" />
                      <span className="hidden sm:inline">Знаю</span>
                    </>
                  )}
                </button>
              </div>

              <div className="mt-3 flex flex-col gap-3">
                <div>
                  <button
                    type="button"
                    onClick={() => toggleReveal(fc.id)}
                    aria-expanded={isRevealed}
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-stone-200 dark:border-slate-700 bg-white dark:bg-[#14171F] px-3.5 py-2 text-sm font-medium text-blue-800 dark:text-blue-400 transition-colors hover:bg-blue-50 dark:hover:bg-blue-950/30 cursor-pointer"
                  >
                    {isRevealed ? (
                      <>
                        <RotateCcw className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        <span>Сховати відповідь</span>
                      </>
                    ) : (
                      <>
                        <Eye className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        <span>Перевірити відповідь</span>
                      </>
                    )}
                  </button>
                </div>

                {isRevealed && (
                  <div className="rounded-xl border border-stone-200/90 dark:border-slate-800 bg-white dark:bg-[#14171F] p-4 text-[15px] leading-[1.7] text-stone-800 dark:text-slate-200 break-words">
                    <span className="font-semibold text-stone-950 dark:text-white mr-1.5">
                      Відповідь:
                    </span>
                    {fc.answer}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export const TextbookView: React.FC<TextbookViewProps> = ({
  chapters,
  activeChapterId,
  onSelectChapter,
  readerMode,
  onChangeReaderMode,
  readChapterIds,
  onToggleReadChapter,
  masteredIds,
  onToggleMasteredCard,
  monuments,
  onSelectMonument,
  onSelectView,
  onJumpToAnchor,
}) => {
  const activeIdx = Math.max(
    0,
    chapters.findIndex((c) => c.id === activeChapterId)
  );
  const currentChapter = chapters[activeIdx];
  const prevChapter = activeIdx > 0 ? chapters[activeIdx - 1] : null;
  const nextChapter = activeIdx < chapters.length - 1 ? chapters[activeIdx + 1] : null;

  const displayedChapters = readerMode === 'full' ? chapters : [currentChapter];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* Compact Editorial Theme Header */}
      <section className="mb-8 rounded-2xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-[#14171F] p-5 sm:p-8 shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div className="max-w-3xl">
            <div className="text-xs font-semibold uppercase tracking-widest text-blue-800 dark:text-blue-400 mb-2">
              Історія України · Підготовка до НМТ · Тема 4
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-[44px] font-bold tracking-tight leading-[1.12] text-stone-950 dark:text-white">
              Королівство руське (Галицько-Волинська держава). Монгольська навала
            </h1>
            <p className="mt-3 text-[15px] sm:text-base leading-relaxed text-stone-600 dark:text-slate-300">
              Повний, не скорочений навчальний посібник: 10 розділів, усі пастки НМТ, хронологічні таблиці, історичні цитати з маркерами, глосарій, пам’ятки культури та 100 флеш-карток.
            </p>
            <div className="mt-3 text-xs sm:text-sm text-stone-500 dark:text-slate-400 tabular-nums">
              10 розділів · 100 флеш-карток · Опрацьовано {readChapterIds.size} з {chapters.length} розділів
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
            <div
              role="group"
              aria-label="Режим читання підручника"
              className="inline-flex rounded-xl border border-stone-200 dark:border-slate-800 bg-stone-100/70 dark:bg-slate-900 p-1"
            >
              <button
                type="button"
                onClick={() => onChangeReaderMode('chapter')}
                className={`min-h-[44px] flex-1 sm:flex-initial rounded-lg px-3.5 py-2 text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  readerMode === 'chapter'
                    ? 'bg-white dark:bg-[#14171F] text-stone-950 dark:text-white shadow-xs'
                    : 'text-stone-600 dark:text-slate-400 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                За розділами
              </button>
              <button
                type="button"
                onClick={() => onChangeReaderMode('full')}
                className={`min-h-[44px] flex-1 sm:flex-initial rounded-lg px-3.5 py-2 text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  readerMode === 'full'
                    ? 'bg-white dark:bg-[#14171F] text-stone-950 dark:text-white shadow-xs'
                    : 'text-stone-600 dark:text-slate-400 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                Весь підручник
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => onSelectView('summary')}
                className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl border border-stone-200 dark:border-slate-800 bg-stone-50 dark:bg-slate-900/70 px-3 py-2 text-xs font-semibold text-stone-800 dark:text-slate-200 hover:bg-stone-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <FileText className="h-3.5 w-3.5 shrink-0 text-blue-700 dark:text-blue-400" aria-hidden="true" />
                <span>Конспект</span>
              </button>
              <button
                type="button"
                onClick={() => onSelectView('visuals')}
                className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl border border-stone-200 dark:border-slate-800 bg-stone-50 dark:bg-slate-900/70 px-3 py-2 text-xs font-semibold text-stone-800 dark:text-slate-200 hover:bg-stone-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <Image className="h-3.5 w-3.5 shrink-0 text-blue-700 dark:text-blue-400" aria-hidden="true" />
                <span>Джерела</span>
              </button>
              <button
                type="button"
                onClick={() => onSelectView('flashcards')}
                className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl border border-stone-200 dark:border-slate-800 bg-stone-50 dark:bg-slate-900/70 px-3 py-2 text-xs font-semibold text-stone-800 dark:text-slate-200 hover:bg-stone-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5 shrink-0 text-blue-700 dark:text-blue-400" aria-hidden="true" />
                <span>Картки</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Horizontal Chapter Switcher (< lg) */}
      <div className="lg:hidden mb-6">
        <div className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-slate-400 mb-2">
          Швидкий перехід по розділах
        </div>
        <div className="flex overflow-x-auto no-scrollbar gap-2 pb-1">
          {chapters.map((ch) => {
            const active = readerMode === 'chapter' && ch.id === currentChapter.id;
            const isRead = readChapterIds.has(ch.id);
            return (
              <button
                key={ch.id}
                type="button"
                onClick={() => {
                  if (readerMode === 'full') {
                    onJumpToAnchor(ch.id);
                  } else {
                    onSelectChapter(ch.id);
                  }
                }}
                className={`inline-flex min-h-[44px] shrink-0 items-center gap-2 rounded-xl border px-3.5 py-2 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  active
                    ? 'border-blue-800 bg-blue-800 text-white dark:border-blue-600 dark:bg-blue-600'
                    : 'border-stone-200 dark:border-slate-800 bg-white dark:bg-[#14171F] text-stone-800 dark:text-slate-200 hover:border-stone-300 dark:hover:border-slate-700'
                }`}
              >
                <span className="font-mono font-semibold tabular-nums">{ch.number}.</span>
                <span>{ch.shortTitle}</span>
                {isRead && (
                  <CheckCircle2
                    className={`h-3.5 w-3.5 shrink-0 ${
                      active ? 'text-blue-100' : 'text-emerald-600 dark:text-emerald-400'
                    }`}
                    aria-hidden="true"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main 2-Column Editorial Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Desktop Sticky TOC Rail */}
        <aside
          aria-label="Зміст розділів"
          className="hidden lg:block lg:col-span-4 xl:col-span-3 sticky top-20 space-y-4"
        >
          <div className="rounded-2xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-[#14171F] p-4 shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-200 dark:border-slate-800">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-slate-400">
                Зміст підручника
              </span>
              <span className="font-mono text-xs text-stone-500 dark:text-slate-400 tabular-nums">
                {readChapterIds.size}/{chapters.length}
              </span>
            </div>

            <div className="space-y-1">
              {chapters.map((ch) => {
                const isActive = readerMode === 'chapter' && ch.id === currentChapter.id;
                const isRead = readChapterIds.has(ch.id);

                return (
                  <div key={ch.id} className="space-y-1">
                    <button
                      type="button"
                      onClick={() => {
                        if (readerMode === 'full') {
                          onJumpToAnchor(ch.id);
                        } else {
                          onSelectChapter(ch.id);
                        }
                      }}
                      className={`flex min-h-[44px] w-full items-start justify-between gap-2 rounded-xl px-3 py-2 text-left text-[13.5px] transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-blue-50 text-blue-900 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-200 dark:border-blue-800 font-semibold'
                          : 'text-stone-700 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-800/70'
                      }`}
                    >
                      <span className="flex items-start gap-2 min-w-0">
                        <span className="font-mono text-xs font-semibold text-stone-400 dark:text-slate-500 pt-0.5 tabular-nums shrink-0">
                          {String(ch.number).padStart(2, '0')}
                        </span>
                        <span className="leading-snug">{ch.shortTitle}</span>
                      </span>
                      {isRead && (
                        <CheckCircle2
                          className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5"
                          aria-label="Опрацьовано"
                        />
                      )}
                    </button>

                    {isActive && (
                      <div className="ml-6 pl-3 border-l border-stone-200 dark:border-slate-800 space-y-1 py-1">
                        {ch.subsections.map((sub) => (
                          <button
                            key={sub.id}
                            type="button"
                            onClick={() => onJumpToAnchor(sub.id)}
                            className="block w-full rounded-lg px-2 py-1.5 text-left text-xs leading-snug text-stone-600 dark:text-slate-400 hover:text-blue-800 dark:hover:text-blue-300 hover:bg-stone-100/70 dark:hover:bg-slate-800/50 cursor-pointer"
                          >
                            {sub.title}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Main Reading Column */}
        <main className="lg:col-span-8 xl:col-span-9 min-w-0 space-y-12">
          {displayedChapters.map((chapter) => {
            const isRead = readChapterIds.has(chapter.id);
            return (
              <article
                key={chapter.id}
                id={chapter.id}
                className="scroll-mt-20 rounded-2xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-[#14171F] p-5 sm:p-8 lg:p-10 shadow-[0_2px_10px_rgb(0,0,0,0.02)]"
              >
                {/* Chapter Header */}
                <header className="pb-6 mb-7 border-b border-stone-200 dark:border-slate-800">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                    <div className="text-xs font-semibold uppercase tracking-widest text-blue-800 dark:text-blue-400 font-mono">
                      Розділ {chapter.number} · {chapter.period}
                    </div>
                    <button
                      type="button"
                      onClick={() => onToggleReadChapter(chapter.id)}
                      className={`inline-flex min-h-[44px] items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                        isRead
                          ? 'border-emerald-600 bg-emerald-700 text-white dark:border-emerald-500 dark:bg-emerald-600'
                          : 'border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-900 text-stone-700 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <BookOpenCheck className="h-4 w-4 shrink-0" aria-hidden="true" />
                      <span>{isRead ? 'Розділ опрацьовано' : 'Позначити опрацьованим'}</span>
                    </button>
                  </div>

                  <h2 className="font-serif text-2xl sm:text-3xl lg:text-[34px] font-bold tracking-tight leading-[1.18] text-stone-950 dark:text-white">
                    {chapter.title}
                  </h2>

                  {chapter.intro.length > 0 && (
                    <div className="mt-5 space-y-4">
                      {chapter.intro.map((para, pIdx) => (
                        <p
                          key={pIdx}
                          className={`text-[16px] sm:text-[17px] leading-[1.78] text-stone-800 dark:text-slate-200 max-w-[72ch] break-words ${
                            pIdx === 0
                              ? 'first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-serif first-letter:text-5xl first-letter:font-bold first-letter:leading-[0.85] first-letter:text-blue-800 dark:first-letter:text-blue-400'
                              : ''
                          }`}
                        >
                          <RichTextSpan runs={para} />
                        </p>
                      ))}
                    </div>
                  )}

                  {/* Quick In-Chapter Anchors */}
                  <div className="mt-6 pt-5 border-t border-stone-200/70 dark:border-slate-800/70">
                    <div className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-slate-400 mb-2">
                      У цьому розділі:
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                      {chapter.subsections.map((sub) => (
                        <button
                          key={sub.id}
                          type="button"
                          onClick={() => onJumpToAnchor(sub.id)}
                          className="text-left text-sm font-medium text-blue-800 dark:text-blue-400 hover:underline py-1 cursor-pointer"
                        >
                          {sub.title}
                        </button>
                      ))}
                    </div>
                  </div>
                </header>

                {/* Subsections */}
                <div className="space-y-10">
                  {chapter.subsections.map((sub) => (
                    <section key={sub.id} id={sub.id} className="scroll-mt-20">
                      <h3 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-stone-950 dark:text-white mb-4 pb-2 border-b border-stone-200/70 dark:border-slate-800/70">
                        {sub.title}
                      </h3>
                      <ContentBlocksRenderer
                        blocks={sub.blocks}
                        monuments={monuments}
                        onSelectMonument={onSelectMonument}
                      />
                    </section>
                  ))}
                </div>

                {/* Chapter Inline Self-Check Flashcards */}
                <InlineChapterFlashcards
                  flashcards={chapter.flashcards}
                  masteredIds={masteredIds}
                  onToggleMasteredCard={onToggleMasteredCard}
                />

                {/* Bottom Chapter Pagination in Chapter Mode */}
                {readerMode === 'chapter' && (
                  <footer className="mt-10 pt-6 border-t border-stone-200 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    {prevChapter ? (
                      <button
                        type="button"
                        onClick={() => {
                          onSelectChapter(prevChapter.id);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="inline-flex min-h-[48px] items-center justify-start gap-3 rounded-xl border border-stone-200 dark:border-slate-800 bg-stone-50 dark:bg-slate-900/60 px-4 py-3 text-left transition-colors hover:bg-stone-100 dark:hover:bg-slate-800 cursor-pointer"
                      >
                        <ArrowLeft className="h-4 w-4 shrink-0 text-stone-500" aria-hidden="true" />
                        <span>
                          <span className="block text-[11px] uppercase tracking-wider text-stone-500 dark:text-slate-400">
                            Попередній розділ
                          </span>
                          <span className="block text-sm font-semibold text-stone-900 dark:text-white">
                            {prevChapter.number}. {prevChapter.shortTitle}
                          </span>
                        </span>
                      </button>
                    ) : (
                      <div />
                    )}

                    {nextChapter ? (
                      <button
                        type="button"
                        onClick={() => {
                          onSelectChapter(nextChapter.id);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="inline-flex min-h-[48px] items-center justify-end gap-3 rounded-xl border border-blue-800 bg-blue-800 dark:border-blue-600 dark:bg-blue-600 px-4 py-3 text-right text-white transition-colors hover:bg-blue-900 dark:hover:bg-blue-500 cursor-pointer"
                      >
                        <span>
                          <span className="block text-[11px] uppercase tracking-wider text-blue-100">
                            Наступний розділ
                          </span>
                          <span className="block text-sm font-semibold">
                            {nextChapter.number}. {nextChapter.shortTitle}
                          </span>
                        </span>
                        <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          onSelectView('summary');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="inline-flex min-h-[48px] items-center justify-end gap-3 rounded-xl border border-blue-800 bg-blue-800 dark:border-blue-600 dark:bg-blue-600 px-4 py-3 text-right text-white transition-colors hover:bg-blue-900 dark:hover:bg-blue-500 cursor-pointer"
                      >
                        <span>
                          <span className="block text-[11px] uppercase tracking-wider text-blue-100">
                            Фінальне узагальнення
                          </span>
                          <span className="block text-sm font-semibold">
                            Стислий опорний конспект для НМТ
                          </span>
                        </span>
                        <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                      </button>
                    )}
                  </footer>
                )}
              </article>
            );
          })}
        </main>
      </div>
    </div>
  );
};
