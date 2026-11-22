import React, { useMemo, useState } from 'react';
import { ArrowUpRight, Maximize2 } from 'lucide-react';
import { MonumentAsset } from '../types/content';

interface VisualSourcesViewProps {
  sources: MonumentAsset[];
  onSelectSource: (source: MonumentAsset) => void;
  onJumpToChapter: (chapterId: string) => void;
}

type VisualFilter = 'all' | 'map' | 'portrait' | 'monument';

export const VisualSourcesView: React.FC<VisualSourcesViewProps> = ({
  sources,
  onSelectSource,
  onJumpToChapter,
}) => {
  const [activeFilter, setActiveFilter] = useState<VisualFilter>('all');

  const counts = useMemo(() => {
    const maps = sources.filter((s) => s.category === 'map').length;
    const portraits = sources.filter((s) => s.category === 'portrait').length;
    const monuments = sources.filter((s) => s.category === 'monument' || !s.category).length;
    return { all: sources.length, maps, portraits, monuments };
  }, [sources]);

  const filteredSources = useMemo(() => {
    if (activeFilter === 'all') return sources;
    if (activeFilter === 'monument') {
      return sources.filter((s) => s.category === 'monument' || !s.category);
    }
    return sources.filter((s) => s.category === activeFilter);
  }, [sources, activeFilter]);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <header className="mb-8 rounded-2xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-[#14171F] p-5 sm:p-8 shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
        <div className="text-xs font-semibold uppercase tracking-widest text-blue-800 dark:text-blue-400 mb-2">
          Карти, історичні сцени, портрети й пам’ятки НМТ
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight leading-[1.15] text-stone-950 dark:text-white">
          Візуальні джерела
        </h1>
        <p className="mt-3 text-[15.5px] sm:text-base leading-relaxed text-stone-700 dark:text-slate-300 max-w-[72ch]">
          Усі історичні карти й картосхеми, портрети та сцени коронації, а також обов’язкові пам’ятки архітектури, іконопису та сфрагістики з маркерами розпізнавання та пастками НМТ. Натисніть на будь-яке зображення, щоб відкрити у великому форматі.
        </p>

        <div className="mt-6 flex overflow-x-auto no-scrollbar gap-2 pb-1">
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`inline-flex min-h-[44px] shrink-0 items-center rounded-xl border px-4 py-2 text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeFilter === 'all'
                ? 'border-blue-800 bg-blue-800 text-white dark:border-blue-600 dark:bg-blue-600'
                : 'border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-900 text-stone-800 dark:text-slate-200 hover:bg-stone-100 dark:hover:bg-slate-800'
            }`}
          >
            Усі джерела ({counts.all})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('map')}
            className={`inline-flex min-h-[44px] shrink-0 items-center rounded-xl border px-4 py-2 text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeFilter === 'map'
                ? 'border-blue-800 bg-blue-800 text-white dark:border-blue-600 dark:bg-blue-600'
                : 'border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-900 text-stone-800 dark:text-slate-200 hover:bg-stone-100 dark:hover:bg-slate-800'
            }`}
          >
            Карти й картосхеми ({counts.maps})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('portrait')}
            className={`inline-flex min-h-[44px] shrink-0 items-center rounded-xl border px-4 py-2 text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeFilter === 'portrait'
                ? 'border-blue-800 bg-blue-800 text-white dark:border-blue-600 dark:bg-blue-600'
                : 'border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-900 text-stone-800 dark:text-slate-200 hover:bg-stone-100 dark:hover:bg-slate-800'
            }`}
          >
            Портрети й історичні сцени ({counts.portraits})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('monument')}
            className={`inline-flex min-h-[44px] shrink-0 items-center rounded-xl border px-4 py-2 text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeFilter === 'monument'
                ? 'border-blue-800 bg-blue-800 text-white dark:border-blue-600 dark:bg-blue-600'
                : 'border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-900 text-stone-800 dark:text-slate-200 hover:bg-stone-100 dark:hover:bg-slate-800'
            }`}
          >
            Пам’ятки, фортеці й реліквії ({counts.monuments})
          </button>
        </div>
      </header>

      <main>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSources.map((item) => {
            const categoryLabel =
              item.category === 'map'
                ? 'Карта / картосхема'
                : item.category === 'portrait'
                ? 'Портрет / сцена'
                : 'Пам’ятка культури';

            return (
              <article
                key={item.id}
                className="group flex flex-col rounded-2xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-[#14171F] overflow-hidden shadow-[0_2px_10px_rgb(0,0,0,0.02)] transition-all duration-300 hover:border-blue-300 dark:hover:border-blue-700 md:hover:-translate-y-0.5"
              >
                <button
                  type="button"
                  onClick={() => onSelectSource(item)}
                  aria-label={`Відкрити візуальне джерело: ${item.title}`}
                  className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100/80 dark:bg-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 cursor-pointer"
                >
                  <img
                    src={item.imagePath}
                    alt={item.title}
                    loading="lazy"
                    className="h-full w-full object-contain p-2.5 transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                  <span className="absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-lg bg-stone-900/80 dark:bg-slate-950/85 px-2.5 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
                    <Maximize2 className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Розглянути</span>
                  </span>
                </button>

                <div className="flex flex-1 flex-col p-5">
                  <div className="text-xs font-mono text-stone-500 dark:text-slate-400 mb-1.5">
                    {item.orderNumber ? `Джерело ${item.orderNumber} · ` : ''}
                    {categoryLabel} · {item.date}
                  </div>

                  <h2 className="font-serif text-xl font-bold leading-snug text-stone-950 dark:text-white mb-2">
                    {item.title}
                  </h2>

                  <p className="text-[13.5px] leading-relaxed text-stone-600 dark:text-slate-400 mb-3">
                    {item.visualFeature}
                  </p>

                  <p className="text-sm leading-relaxed text-stone-800 dark:text-slate-200 mb-3 flex-1">
                    <strong className="font-semibold text-blue-800 dark:text-blue-400">
                      Маркер НМТ:{' '}
                    </strong>
                    {item.markerDetail.replace(/^Маркер:\s*/i, '')}
                  </p>

                  <div className="pt-3 border-t border-stone-200/80 dark:border-slate-800/80 space-y-2.5">
                    <div className="text-xs leading-relaxed text-amber-800 dark:text-amber-300">
                      <strong className="font-semibold">Пастка НМТ: </strong>
                      {item.trapDetail.replace(/^Пастка:\s*/i, '')}
                    </div>

                    {item.relatedChapterId && (
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => onJumpToChapter(item.relatedChapterId!)}
                          className="inline-flex min-h-[44px] items-center gap-1 text-xs font-semibold text-blue-800 dark:text-blue-400 hover:underline cursor-pointer"
                        >
                          <span>Читати у підручнику</span>
                          <ArrowUpRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </main>
    </div>
  );
};
