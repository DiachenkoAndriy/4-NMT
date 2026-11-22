import React, { useEffect } from 'react';
import {
  BookOpen,
  CheckCircle2,
  FileText,
  Image,
  Sparkles,
  X,
} from 'lucide-react';
import { AppView, Chapter } from '../types/content';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeView: AppView;
  onSelectView: (view: AppView) => void;
  chapters: Chapter[];
  activeChapterId: string;
  onSelectChapter: (chapterId: string) => void;
  readChapterIds: Set<string>;
  masteredCount: number;
  totalCards: number;
}

const VIEW_BUTTONS: { id: AppView; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'reader', label: 'Підручник', icon: BookOpen },
  { id: 'summary', label: 'Конспект НМТ', icon: FileText },
  { id: 'visuals', label: 'Візуальні джерела', icon: Image },
  { id: 'flashcards', label: 'Флеш-картки', icon: Sparkles },
];

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  activeView,
  onSelectView,
  chapters,
  activeChapterId,
  onSelectChapter,
  readChapterIds,
  masteredCount,
  totalCards,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 md:hidden flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="Мобільне меню навігації"
    >
      <button
        type="button"
        aria-label="Закрити меню"
        onClick={onClose}
        className="fixed inset-0 bg-stone-950/50 backdrop-blur-xs"
      />
      <div className="relative z-10 flex h-full w-full max-w-xs flex-col border-l border-stone-200 dark:border-slate-800 bg-[#F9F8F5] dark:bg-[#0C0E12] shadow-2xl">
        <div className="flex h-14 items-center justify-between border-b border-stone-200 dark:border-slate-800 px-4">
          <span className="font-serif text-lg font-bold text-stone-950 dark:text-white">
            Навігація
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрити меню навігації"
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-stone-700 dark:text-slate-300 hover:bg-stone-200/70 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
          {/* Primary Sections */}
          <div className="space-y-1.5">
            <div className="px-2 text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-slate-400 mb-2">
              Розділи сайту
            </div>
            {VIEW_BUTTONS.map((btn) => {
              const Icon = btn.icon;
              const active = activeView === btn.id;
              return (
                <button
                  key={btn.id}
                  type="button"
                  onClick={() => {
                    onSelectView(btn.id);
                    onClose();
                  }}
                  className={`flex min-h-[48px] w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-[15px] font-medium transition-colors ${
                    active
                      ? 'bg-blue-800 text-white dark:bg-blue-600'
                      : 'text-stone-800 dark:text-slate-200 hover:bg-stone-200/70 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span>{btn.label}</span>
                  </span>
                  {btn.id === 'flashcards' && (
                    <span className="font-mono text-xs tabular-nums opacity-80">
                      {masteredCount}/{totalCards}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* 10 Chapters Direct Links */}
          <div className="space-y-1.5">
            <div className="px-2 text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-slate-400 mb-2">
              Зміст підручника (10 розділів)
            </div>
            {chapters.map((ch) => {
              const isCurrent = activeView === 'reader' && activeChapterId === ch.id;
              const isRead = readChapterIds.has(ch.id);
              return (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => {
                    onSelectChapter(ch.id);
                    onSelectView('reader');
                    onClose();
                  }}
                  className={`flex min-h-[46px] w-full items-center justify-between gap-2 rounded-xl px-3.5 py-2.5 text-left text-sm transition-colors ${
                    isCurrent
                      ? 'bg-blue-50 text-blue-900 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-200 dark:border-blue-800 font-semibold'
                      : 'text-stone-700 dark:text-slate-300 hover:bg-stone-200/60 dark:hover:bg-slate-800/70'
                  }`}
                >
                  <span className="flex items-start gap-2.5">
                    <span className="font-mono text-xs font-semibold text-stone-400 dark:text-slate-500 pt-0.5 tabular-nums">
                      {String(ch.number).padStart(2, '0')}
                    </span>
                    <span className="leading-snug">{ch.shortTitle}</span>
                  </span>
                  {isRead && (
                    <CheckCircle2
                      className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400"
                      aria-label="Опрацьовано"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
