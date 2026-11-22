import React from 'react';
import {
  AlertTriangle,
  BookOpenCheck,
  Clock,
  Quote,
  Maximize2,
  Bookmark,
} from 'lucide-react';
import {
  ContentBlock,
  ListItem,
  MonumentAsset,
  RichText,
} from '../types/content';
import { ResponsiveTable } from './ResponsiveTable';

export const RichTextSpan: React.FC<{ runs: RichText }> = ({ runs }) => {
  return (
    <>
      {runs.map((run, idx) => {
        if (typeof run === 'string') {
          return <React.Fragment key={idx}>{run}</React.Fragment>;
        }
        if (run.bold && run.italic) {
          return (
            <strong key={idx} className="font-semibold italic text-stone-950 dark:text-white">
              {run.text}
            </strong>
          );
        }
        if (run.bold) {
          return (
            <strong key={idx} className="font-semibold text-stone-950 dark:text-white">
              {run.text}
            </strong>
          );
        }
        if (run.italic) {
          return (
            <em key={idx} className="italic">
              {run.text}
            </em>
          );
        }
        return <React.Fragment key={idx}>{run.text}</React.Fragment>;
      })}
    </>
  );
};

const ListBlock: React.FC<{
  items: ListItem[];
  ordered?: boolean;
}> = ({ items, ordered = false }) => {
  const Tag = ordered ? 'ol' : 'ul';
  return (
    <Tag
      className={`my-4 space-y-2.5 pl-5 sm:pl-6 text-[15.5px] sm:text-base leading-[1.75] text-stone-800 dark:text-slate-200 ${
        ordered ? 'list-decimal marker:font-mono marker:font-semibold marker:text-blue-700 dark:marker:text-blue-400' : 'list-disc marker:text-stone-400 dark:marker:text-slate-500'
      }`}
    >
      {items.map((item, idx) => (
        <li key={idx} className="pl-1.5 break-words">
          <RichTextSpan runs={item.content} />
          {item.subItems && item.subItems.length > 0 && (
            <ul className="mt-2 space-y-1.5 pl-4 sm:pl-5 list-[circle] marker:text-stone-400 dark:marker:text-slate-500 text-[15px] leading-relaxed text-stone-700 dark:text-slate-300">
              {item.subItems.map((sub, subIdx) => (
                <li key={subIdx} className="pl-1 break-words">
                  <RichTextSpan runs={sub} />
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </Tag>
  );
};

interface ContentBlocksRendererProps {
  blocks: ContentBlock[];
  monuments?: MonumentAsset[];
  onSelectMonument?: (monument: MonumentAsset) => void;
}

export const ContentBlocksRenderer: React.FC<ContentBlocksRendererProps> = ({
  blocks,
  monuments = [],
  onSelectMonument,
}) => {
  return (
    <div className="space-y-5">
      {blocks.map((block, idx) => {
        switch (block.type) {
          case 'paragraph':
            return (
              <p
                key={idx}
                className={`text-[15.5px] sm:text-[16.5px] leading-[1.78] text-stone-800 dark:text-slate-200 max-w-[72ch] break-words ${
                  block.dropCap
                    ? 'first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-serif first-letter:text-5xl first-letter:font-bold first-letter:leading-[0.85] first-letter:text-blue-800 dark:first-letter:text-blue-400'
                    : ''
                }`}
              >
                <RichTextSpan runs={block.content} />
              </p>
            );

          case 'subheading':
            return (
              <h4
                key={idx}
                className="pt-3 font-serif text-xl sm:text-2xl font-semibold tracking-tight text-stone-950 dark:text-white"
              >
                <RichTextSpan runs={block.content} />
              </h4>
            );

          case 'bullets':
            return <ListBlock key={idx} items={block.items} />;

          case 'numbered':
            return <ListBlock key={idx} items={block.items} ordered />;

          case 'callout': {
            const isTrap = block.variant === 'trap';
            const isChrono = block.variant === 'chronology';

            const containerClass = isTrap
              ? 'border-amber-300/90 dark:border-amber-700/60 bg-amber-50/70 dark:bg-amber-950/20'
              : isChrono
              ? 'border-blue-200 dark:border-blue-800/70 bg-blue-50/60 dark:bg-blue-950/20'
              : 'border-stone-300 dark:border-slate-700 bg-stone-100/80 dark:bg-slate-900/70';

            const labelClass = isTrap
              ? 'text-amber-800 dark:text-amber-300'
              : isChrono
              ? 'text-blue-800 dark:text-blue-300'
              : 'text-stone-800 dark:text-slate-200';

            const Icon = isTrap ? AlertTriangle : isChrono ? Clock : BookOpenCheck;
            const defaultLabel = isTrap
              ? 'Пастка НМТ'
              : isChrono
              ? 'Хронологічний фокус'
              : 'Важливо для НМТ';

            return (
              <div
                key={idx}
                className={`my-6 rounded-xl border p-4 sm:p-6 ${containerClass}`}
              >
                <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-2.5 ${labelClass}`}>
                  <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>
                    {block.title ? <RichTextSpan runs={block.title} /> : defaultLabel}
                  </span>
                </div>
                {block.content.length > 0 && (
                  <p className="text-[15px] sm:text-[15.5px] leading-[1.72] text-stone-800 dark:text-slate-200 break-words">
                    <RichTextSpan runs={block.content} />
                  </p>
                )}
                {block.items && block.items.length > 0 && (
                  <ListBlock items={block.items} />
                )}
              </div>
            );
          }

          case 'table':
            return <ResponsiveTable key={idx} table={block.table} />;

          case 'quotes':
            return (
              <div key={idx} className="my-6 space-y-4">
                {block.items.map((q) => (
                  <figure
                    key={q.id}
                    className="rounded-xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-[#14171F] p-5 sm:p-6 shadow-[0_2px_10px_rgb(0,0,0,0.02)]"
                  >
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-800 dark:text-blue-400 mb-3">
                      <Quote className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      <span>
                        <RichTextSpan runs={q.title} />
                      </span>
                    </div>
                    <blockquote className="font-serif text-lg sm:text-[21px] leading-[1.6] text-stone-900 dark:text-slate-100 italic">
                      <RichTextSpan runs={q.quote} />
                    </blockquote>
                    <figcaption className="mt-4 pt-3.5 border-t border-stone-200/80 dark:border-slate-800/80 text-[14.5px] leading-relaxed text-stone-700 dark:text-slate-300">
                      <span className="font-semibold text-stone-900 dark:text-white mr-1.5">
                        {q.markersLabel || 'Слова-маркери:'}
                      </span>
                      <RichTextSpan runs={q.markers} />
                    </figcaption>
                  </figure>
                ))}
              </div>
            );

          case 'glossary':
            return (
              <dl key={idx} className="my-6 grid grid-cols-1 gap-3">
                {block.items.map((item, gIdx) => (
                  <div
                    key={gIdx}
                    className="rounded-xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-[#14171F] p-4 sm:p-5"
                  >
                    <dt className="flex items-center gap-2 font-serif text-lg sm:text-xl font-semibold text-stone-950 dark:text-white mb-1.5">
                      <Bookmark className="h-4 w-4 text-blue-700 dark:text-blue-400 shrink-0" aria-hidden="true" />
                      <span>{item.term}</span>
                    </dt>
                    <dd className="text-[15px] sm:text-[15.5px] leading-[1.7] text-stone-700 dark:text-slate-300 break-words">
                      <RichTextSpan runs={item.definition} />
                    </dd>
                  </div>
                ))}
              </dl>
            );

          case 'monuments_gallery':
            return (
              <div key={idx} className="my-6 space-y-5">
                {block.intro && (
                  <p className="text-[15.5px] sm:text-[16.5px] leading-[1.78] text-stone-800 dark:text-slate-200 max-w-[72ch]">
                    <RichTextSpan runs={block.intro} />
                  </p>
                )}

                {monuments.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                    {monuments.map((m) => (
                      <article
                        key={m.id}
                        className="group flex flex-col rounded-xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-[#14171F] overflow-hidden shadow-[0_2px_10px_rgb(0,0,0,0.02)] transition-all duration-300 hover:border-blue-300 dark:hover:border-blue-700 md:hover:-translate-y-0.5"
                      >
                        <button
                          type="button"
                          onClick={() => onSelectMonument?.(m)}
                          aria-label={`Збільшити пам'ятку: ${m.title}`}
                          className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100 dark:bg-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 cursor-pointer"
                        >
                          <img
                            src={m.imagePath}
                            alt={m.title}
                            loading="lazy"
                            className="h-full w-full object-contain p-2 transition-transform duration-300 group-hover:scale-[1.03]"
                          />
                          <span className="absolute right-2.5 bottom-2.5 inline-flex items-center gap-1 rounded-lg bg-stone-900/80 dark:bg-slate-950/85 px-2.5 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
                            <Maximize2 className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>Детально</span>
                          </span>
                        </button>
                        <div className="flex flex-1 flex-col p-4 sm:p-5">
                          <div className="text-xs font-mono text-stone-500 dark:text-slate-400 mb-1">
                            {m.date} · {m.locationAndAuthor}
                          </div>
                          <h4 className="font-serif text-lg font-semibold leading-snug text-stone-950 dark:text-white mb-2">
                            {m.title}
                          </h4>
                          <p className="text-[14px] leading-relaxed text-stone-700 dark:text-slate-300 mb-3 flex-1">
                            {m.visualFeature}
                          </p>
                          <div className="pt-3 border-t border-stone-200/80 dark:border-slate-800/80 text-xs leading-relaxed text-amber-800 dark:text-amber-300">
                            <strong className="font-semibold">Пастка НМТ: </strong>
                            {m.trapDetail.replace(/^Пастка:\s*/i, '')}
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                )}

                {block.detailsSummary && (
                  <p className="text-[15.5px] sm:text-[16.5px] leading-[1.78] text-stone-800 dark:text-slate-200 max-w-[72ch]">
                    <RichTextSpan runs={block.detailsSummary} />
                  </p>
                )}
              </div>
            );
        }
      })}
    </div>
  );
};
