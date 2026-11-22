import React, { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import {
  ALL_FLASHCARDS,
  ALL_VISUAL_SOURCES,
  CHAPTERS,
  MONUMENTS,
  SUMMARY_MODULE,
} from './data';
import { AppView, MonumentAsset } from './types/content';
import { SearchResult } from './utils/studyHelpers';
import { Navbar } from './components/Navbar';
import { MobileDrawer } from './components/MobileDrawer';
import { TextbookView } from './components/TextbookView';
import { SummaryView } from './components/SummaryView';
import { VisualSourcesView } from './components/VisualSourcesView';
import { FlashcardsView } from './components/FlashcardsView';
import { SearchModal } from './components/SearchModal';
import { MonumentModal } from './components/MonumentModal';

function readStoredIds(key: string): Set<string> {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? new Set(parsed) : new Set();
  } catch {
    return new Set();
  }
}

export default function App() {
  const [activeView, setActiveView] = useState<AppView>('reader');
  const [activeChapterId, setActiveChapterId] = useState<string>(() => {
    try {
      const saved = window.localStorage.getItem('kr_active_chapter');
      if (saved && CHAPTERS.some((c) => c.id === saved)) {
        return saved;
      }
    } catch {
      // ignore storage failure
    }
    return CHAPTERS[0].id;
  });
  const [readerMode, setReaderMode] = useState<'chapter' | 'full'>('chapter');
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof document !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  const [masteredIds, setMasteredIds] = useState<Set<string>>(() =>
    readStoredIds('kr_mastered_cards')
  );
  const [readChapterIds, setReadChapterIds] = useState<Set<string>>(() =>
    readStoredIds('kr_read_chapters')
  );

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedMonument, setSelectedMonument] = useState<MonumentAsset | null>(null);
  const [focusCardId, setFocusCardId] = useState<string | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 520);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      try {
        window.localStorage.setItem('kr_theme', next ? 'dark' : 'light');
      } catch {
        // ignore
      }
      return next;
    });
  };

  const handleSelectChapter = (chapterId: string) => {
    setActiveChapterId(chapterId);
    try {
      window.localStorage.setItem('kr_active_chapter', chapterId);
    } catch {
      // ignore
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleMasteredCard = (cardId: string) => {
    setMasteredIds((prev) => {
      const next = new Set(prev);
      if (next.has(cardId)) next.delete(cardId);
      else next.add(cardId);
      try {
        window.localStorage.setItem('kr_mastered_cards', JSON.stringify([...next]));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const handleResetProgress = () => {
    setMasteredIds(new Set());
    try {
      window.localStorage.removeItem('kr_mastered_cards');
    } catch {
      // ignore
    }
  };

  const handleToggleReadChapter = (chapterId: string) => {
    setReadChapterIds((prev) => {
      const next = new Set(prev);
      if (next.has(chapterId)) next.delete(chapterId);
      else next.add(chapterId);
      try {
        window.localStorage.setItem('kr_read_chapters', JSON.stringify([...next]));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const jumpToAnchor = (anchorId: string) => {
    window.setTimeout(() => {
      const el = document.getElementById(anchorId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 60);
  };

  const handleJumpToChapter = (chapterId: string) => {
    setActiveChapterId(chapterId);
    setActiveView('reader');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectSearchResult = (res: SearchResult) => {
    if (res.targetType === 'visual' && res.visualId) {
      const found = ALL_VISUAL_SOURCES.find((v) => v.id === res.visualId) ?? null;
      setActiveView('visuals');
      if (found) setSelectedMonument(found);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (res.targetType === 'flashcard' && res.flashcardId) {
      setFocusCardId(res.flashcardId);
      setActiveView('flashcards');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (res.targetType === 'summary') {
      setActiveView('summary');
      if (res.subsectionId) jumpToAnchor(res.subsectionId);
      else window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setActiveChapterId(res.chapterId);
    setActiveView('reader');
    if (res.subsectionId) jumpToAnchor(res.subsectionId);
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F9F8F5] text-stone-900 dark:bg-[#0C0E12] dark:text-slate-100 transition-colors duration-200 flex flex-col">
      <Navbar
        activeView={activeView}
        onSelectView={(v) => {
          setActiveView(v);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        isDark={isDark}
        onToggleTheme={toggleTheme}
        masteredCount={masteredIds.size}
        totalCards={ALL_FLASHCARDS.length}
      />

      <div className="flex-1">
        {activeView === 'reader' && (
          <TextbookView
            chapters={CHAPTERS}
            activeChapterId={activeChapterId}
            onSelectChapter={handleSelectChapter}
            readerMode={readerMode}
            onChangeReaderMode={setReaderMode}
            readChapterIds={readChapterIds}
            onToggleReadChapter={handleToggleReadChapter}
            masteredIds={masteredIds}
            onToggleMasteredCard={handleToggleMasteredCard}
            monuments={MONUMENTS}
            onSelectMonument={setSelectedMonument}
            onSelectView={(v) => {
              setActiveView(v);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onJumpToAnchor={jumpToAnchor}
          />
        )}

        {activeView === 'summary' && (
          <SummaryView
            summary={SUMMARY_MODULE}
            monuments={MONUMENTS}
            onSelectMonument={setSelectedMonument}
            onJumpToAnchor={jumpToAnchor}
            onSelectView={setActiveView}
          />
        )}

        {activeView === 'visuals' && (
          <VisualSourcesView
            sources={ALL_VISUAL_SOURCES}
            onSelectSource={setSelectedMonument}
            onJumpToChapter={handleJumpToChapter}
          />
        )}

        {activeView === 'flashcards' && (
          <FlashcardsView
            chapters={CHAPTERS}
            allCards={ALL_FLASHCARDS}
            masteredIds={masteredIds}
            onToggleMastered={handleToggleMasteredCard}
            onResetProgress={handleResetProgress}
            initialFocusCardId={focusCardId}
          />
        )}
      </div>

      {/* Footer */}
      <footer className="mt-12 border-t border-stone-200 dark:border-slate-800 bg-white dark:bg-[#14171F]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-sm text-stone-600 dark:text-slate-400">
          <div>
            <span className="font-serif font-bold text-stone-950 dark:text-white">
              Королівство Руське · НМТ
            </span>
            <span className="mx-2">·</span>
            <span>Повний навчальний посібник (10 розділів, 100 флеш-карток, візуальні джерела, конспект)</span>
          </div>
          <div className="flex flex-wrap gap-4">
            <button
              type="button"
              onClick={() => {
                setActiveView('reader');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-blue-800 dark:hover:text-blue-400 cursor-pointer"
            >
              Підручник
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveView('summary');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-blue-800 dark:hover:text-blue-400 cursor-pointer"
            >
              Конспект НМТ
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveView('visuals');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-blue-800 dark:hover:text-blue-400 cursor-pointer"
            >
              Візуальні джерела
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveView('flashcards');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-blue-800 dark:hover:text-blue-400 cursor-pointer"
            >
              Флеш-картки
            </button>
          </div>
        </div>
      </footer>

      {/* Floating Back to Top */}
      {showBackToTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Повернутися догори"
          className="fixed right-4 bottom-4 sm:right-6 sm:bottom-6 z-30 inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-stone-300 dark:border-slate-700 bg-white/90 dark:bg-[#14171F]/90 text-stone-800 dark:text-slate-100 shadow-lg backdrop-blur-md transition-transform hover:-translate-y-0.5 cursor-pointer"
        >
          <ArrowUp className="h-5 w-5" aria-hidden="true" />
        </button>
      )}

      {/* Drawers & Modals */}
      <MobileDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        activeView={activeView}
        onSelectView={(v) => {
          setActiveView(v);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        chapters={CHAPTERS}
        activeChapterId={activeChapterId}
        onSelectChapter={handleSelectChapter}
        readChapterIds={readChapterIds}
        masteredCount={masteredIds.size}
        totalCards={ALL_FLASHCARDS.length}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        chapters={CHAPTERS}
        summary={SUMMARY_MODULE}
        visuals={ALL_VISUAL_SOURCES}
        onSelectResult={handleSelectSearchResult}
      />

      <MonumentModal
        monument={selectedMonument}
        onClose={() => setSelectedMonument(null)}
        onJumpToChapter={handleJumpToChapter}
      />
    </div>
  );
}
