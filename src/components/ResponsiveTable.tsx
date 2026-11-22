import React from 'react';
import { StudyTable } from '../types/content';
import { RichTextSpan } from './RichTextRenderer';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

interface ResponsiveTableProps {
  table: StudyTable;
}

const StatusBadge: React.FC<{ status?: 'correct' | 'trap' | 'warning' }> = ({ status }) => {
  if (!status) return null;
  if (status === 'correct') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
        <CheckCircle2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        <span>Правильно</span>
      </span>
    );
  }
  if (status === 'trap') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-rose-700 dark:text-rose-400">
        <XCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        <span>Пастка НМТ</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
      <AlertTriangle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>Увага</span>
    </span>
  );
};

export const ResponsiveTable: React.FC<ResponsiveTableProps> = ({ table }) => {
  return (
    <div className="my-6 rounded-xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-[#14171F] overflow-hidden shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
      {table.title && (
        <div className="px-4 py-3 sm:px-6 sm:py-3.5 border-b border-stone-200 dark:border-slate-800 bg-stone-50/80 dark:bg-slate-900/60">
          <h4 className="font-serif text-lg sm:text-xl font-semibold tracking-tight text-stone-900 dark:text-slate-100">
            {table.title}
          </h4>
        </div>
      )}

      {/* Desktop & Tablet Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-stone-200 dark:border-slate-800 bg-stone-50/50 dark:bg-slate-900/40">
              {table.headers.map((header, idx) => (
                <th
                  key={idx}
                  scope="col"
                  className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-slate-400"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200/80 dark:divide-slate-800/80">
            {table.rows.map((row, rowIdx) => {
              const rowBg =
                row.status === 'trap'
                  ? 'bg-rose-50/40 dark:bg-rose-950/15'
                  : row.status === 'correct'
                  ? 'bg-emerald-50/35 dark:bg-emerald-950/15'
                  : row.status === 'warning'
                  ? 'bg-amber-50/40 dark:bg-amber-950/15'
                  : '';

              return (
                <tr
                  key={rowIdx}
                  className={`${rowBg} transition-colors hover:bg-stone-50/90 dark:hover:bg-slate-800/40`}
                >
                  {row.cells.map((cell, cellIdx) => (
                    <td
                      key={cellIdx}
                      className={`px-5 py-4 text-[14.5px] leading-relaxed align-top text-stone-800 dark:text-slate-200 ${
                        cellIdx === 0 ? 'font-medium tabular-nums' : ''
                      }`}
                    >
                      {cellIdx === 0 && row.status && (
                        <div className="mb-1.5">
                          <StatusBadge status={row.status} />
                        </div>
                      )}
                      <RichTextSpan runs={cell} />
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Stacked Card View (< md) — Zero horizontal scroll */}
      <div className="md:hidden divide-y divide-stone-200 dark:divide-slate-800">
        {table.rows.map((row, rowIdx) => {
          const cardBg =
            row.status === 'trap'
              ? 'bg-rose-50/40 dark:bg-rose-950/15'
              : row.status === 'correct'
              ? 'bg-emerald-50/35 dark:bg-emerald-950/15'
              : row.status === 'warning'
              ? 'bg-amber-50/40 dark:bg-amber-950/15'
              : '';

          return (
            <div key={rowIdx} className={`p-4 space-y-3 ${cardBg}`}>
              {row.status && (
                <div>
                  <StatusBadge status={row.status} />
                </div>
              )}
              {row.cells.map((cell, cellIdx) => (
                <div key={cellIdx} className="space-y-1">
                  {table.headers[cellIdx] && (
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 dark:text-slate-400">
                      {table.headers[cellIdx]}
                    </div>
                  )}
                  <div
                    className={`text-[15px] leading-relaxed text-stone-800 dark:text-slate-200 break-words ${
                      cellIdx === 0 ? 'font-semibold tabular-nums text-stone-950 dark:text-white' : ''
                    }`}
                  >
                    <RichTextSpan runs={cell} />
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};
