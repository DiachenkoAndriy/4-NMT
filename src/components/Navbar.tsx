import React from 'react';
import {
  BookOpen,
  FileText,
  Image,
  Menu,
  Moon,
  Search,
  Sparkles,
  Sun,
} from 'lucide-react';
import { AppView } from '../types/content';

interface NavbarProps {
  activeView: AppView;
  onSelectView: (view: AppView) => void;
  onOpenSearch: () => void;
  onOpenMobileMenu: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  masteredCount: number;
  totalCards: number;
}

const NAV_ITEMS: { id: AppView; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'reader', label: 'Підручник', icon: BookOpen },
  { id: 'summary', label: 'Конспект НМТ', icon: FileText },
  { id: 'visuals', label: 'Візуальні джерела', icon: Image },
  { id: 'flashcards', label: 'Флеш-картки', icon: Sparkles },
];

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  onSelectView,
  onOpenSearch,
  onOpenMobileMenu,
  isDark,
  onToggleTheme,
  masteredCount,
  totalCards,
}) => {
  return (
    <header className="sticky top-0 z-40 h-14 sm:h-16 border-b border-stone-200/80 dark:border-slate-800/90 bg-[#F9F8F5]/85 dark:bg-[#0C0E12]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          type="button"
          onClick={() => onSelectView('reader')}
          className="flex min-h-[44px] items-center gap-2.5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-lg pr-2 cursor-pointer"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-800 dark:bg-blue-600 font-serif text-base font-bold text-white shadow-xs">
            КР
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-stone-950 dark:text-white whitespace-nowrap">
              Королівство Руське
            </span>
            <span className="hidden sm:block text-[11px] text-stone-500 dark:text-slate-400 mt-0.5 whitespace-nowrap">
              Підготовка до НМТ · Тема 4
            </span>
          </span>
        </button>

        {/* Zone 2: Desktop Single-Line Navigation */}
        <nav aria-label="Основна навігація" className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = activeView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectView(item.id)}
                aria-current={active ? 'page' : undefined}
                className={`inline-flex min-h-[44px] items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  active
                    ? 'bg-blue-800 text-white dark:bg-blue-600 dark:text-white'
                    : 'text-stone-700 hover:bg-stone-200/70 hover:text-stone-950 dark:text-slate-300 dark:hover:bg-slate-800/80 dark:hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{item.label}</span>
                {item.id === 'flashcards' && (
                  <span
                    className={`ml-0.5 font-mono text-xs tabular-nums ${
                      active ? 'text-blue-100' : 'text-stone-500 dark:text-slate-400'
                    }`}
                  >
                    {masteredCount}/{totalCards}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={onOpenSearch}
            aria-label="Пошук по матеріалах"
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 rounded-lg border border-stone-200 dark:border-slate-800 bg-white dark:bg-[#14171F] px-3 text-sm font-medium text-stone-700 dark:text-slate-200 transition-colors hover:border-stone-300 hover:bg-stone-50 dark:hover:border-slate-700 dark:hover:bg-slate-800/70 cursor-pointer"
          >
            <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="hidden lg:inline whitespace-nowrap">Пошук</span>
          </button>

          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={isDark ? 'Увімкнути світлу тему' : 'Увімкнути темну тему'}
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-stone-200 dark:border-slate-800 bg-white dark:bg-[#14171F] text-stone-700 dark:text-slate-200 transition-colors hover:border-stone-300 hover:bg-stone-50 dark:hover:border-slate-700 dark:hover:bg-slate-800/70 cursor-pointer"
          >
            {isDark ? (
              <Sun className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Moon className="h-4 w-4" aria-hidden="true" />
            )}
          </button>

          <button
            type="button"
            onClick={onOpenMobileMenu}
            aria-label="Відкрити меню навігації"
            className="inline-flex md:hidden min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-stone-200 dark:border-slate-800 bg-white dark:bg-[#14171F] text-stone-800 dark:text-slate-200 transition-colors hover:bg-stone-50 dark:hover:bg-slate-800 cursor-pointer"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
};
