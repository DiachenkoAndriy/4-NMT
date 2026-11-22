import React from 'react';
import { BookOpen, Sparkles } from 'lucide-react';
import { AppView, MonumentAsset, SummaryModule } from '../types/content';
import { ContentBlocksRenderer, RichTextSpan } from './RichTextRenderer';

interface SummaryViewProps {
  summary: SummaryModule;
  monuments: MonumentAsset[];
  onSelectMonument: (monument: MonumentAsset) => void;
  onJumpToAnchor: (anchorId: string) => void;
  onSelectView: (view: AppView) => void;
}

export const SummaryView: React.FC<SummaryViewProps> = ({
  summary,
  monuments,
  onSelectMonument,
  onJumpToAnchor,
  onSelectView,
}) => {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <header className="mb-8 rounded-2xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-[#14171F] p-5 sm:p-8 shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
        <div className="text-xs font-semibold uppercase tracking-widest text-blue-800 dark:text-blue-400 mb-2">
          Швидке повторення перед тестом · Тема 4
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight leading-[1.15] text-stone-950 dark:text-white">
          {summary.title}
        </h1>
        <p className="mt-3 text-[15.5px] sm:text-base leading-relaxed text-stone-700 dark:text-slate-300 max-w-[70ch]">
          <RichTextSpan runs={summary.intro} />
        </p>

        {/* Quick Section Jump Pills */}
        <div className="mt-6 pt-5 border-t border-stone-200 dark:border-slate-800">
          <div className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-slate-400 mb-2.5">
            Блоки опорного конспекту:
          </div>
          <div className="flex overflow-x-auto no-scrollbar sm:flex-wrap gap-2 pb-1">
            {summary.sections.map((sec) => (
              <button
                key={sec.id}
                type="button"
                onClick={() => onJumpToAnchor(sec.id)}
                className="inline-flex min-h-[44px] shrink-0 items-center rounded-xl border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-900 px-3.5 py-2 text-xs sm:text-sm font-medium text-stone-800 dark:text-slate-200 whitespace-nowrap transition-colors hover:border-blue-400 hover:text-blue-800 dark:hover:border-blue-600 dark:hover:text-blue-300 cursor-pointer"
              >
                {sec.title}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="space-y-8">
        {summary.sections.map((sec) => (
          <section
            key={sec.id}
            id={sec.id}
            className="scroll-mt-20 rounded-2xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-[#14171F] p-5 sm:p-8 shadow-[0_2px_10px_rgb(0,0,0,0.02)]"
          >
            <h2 className="font-serif text-2xl sm:text-[28px] font-bold tracking-tight text-stone-950 dark:text-white mb-5 pb-3 border-b border-stone-200 dark:border-slate-800">
              {sec.title}
            </h2>
            <ContentBlocksRenderer
              blocks={sec.blocks}
              monuments={monuments}
              onSelectMonument={onSelectMonument}
            />
          </section>
        ))}

        {/* Bottom CTA Strip */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-2xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-[#14171F] p-5 sm:p-6">
          <div>
            <h3 className="font-serif text-xl font-bold text-stone-950 dark:text-white">
              Готові перевірити знання на практиці?
            </h3>
            <p className="text-sm text-stone-600 dark:text-slate-400 mt-1">
              Закріпіть хронологію, поняття та цитати у тренажері зі 100 флеш-карток.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => {
                onSelectView('reader');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-900 px-4 py-2.5 text-sm font-semibold text-stone-800 dark:text-slate-200 hover:bg-stone-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              <BookOpen className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>До підручника</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onSelectView('flashcards');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-blue-800 dark:bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-900 dark:hover:bg-blue-500 cursor-pointer"
            >
              <Sparkles className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>Тренажер: 100 карток</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
