import test from 'node:test';
import assert from 'node:assert/strict';
import { ALL_FLASHCARDS, ALL_VISUAL_SOURCES, CHAPTERS, SUMMARY_MODULE } from '../data';
import {
  calculateProgressStats,
  extractRichTextPlain,
  filterFlashcards,
  searchStudyContent,
} from './studyHelpers';

test('all 10 chapters and 100 flashcards are loaded completely', () => {
  assert.equal(CHAPTERS.length, 10);
  assert.equal(ALL_FLASHCARDS.length, 100);
  for (const ch of CHAPTERS) {
    assert.equal(ch.flashcards.length, 10, `Chapter ${ch.number} must have 10 flashcards`);
  }
  assert.equal(SUMMARY_MODULE.sections.length, 7);
});

test('all 25 visual sources (19 added maps/paintings/monuments + 6 handbook monuments) have valid paths and details', () => {
  assert.equal(ALL_VISUAL_SOURCES.length, 25);
  for (const item of ALL_VISUAL_SOURCES) {
    assert.ok(item.imagePath.startsWith('/assets/'), `Invalid path for ${item.id}`);
    assert.ok(item.title.length > 0);
    assert.ok(item.markerDetail.length > 0);
    assert.ok(item.trapDetail.length > 0);
  }
});

test('extractRichTextPlain preserves text from mixed string and formatted runs', () => {
  const plain = extractRichTextPlain([
    'У ',
    { text: '1199 році', bold: true },
    ' утворилася держава.',
  ]);
  assert.equal(plain, 'У 1199 році утворилася держава.');
});

test('searchStudyContent finds exact historical markers and visual sources', () => {
  assert.deepEqual(searchStudyContent('а', CHAPTERS, SUMMARY_MODULE), []);

  const dorohychynResults = searchStudyContent('Дорогичин', CHAPTERS, SUMMARY_MODULE);
  assert.ok(dorohychynResults.length > 0);
  assert.ok(dorohychynResults.some((r) => r.chapterId === 'ch-6' || r.chapterId === 'ch-7'));

  const baskakResults = searchStudyContent('баскак', CHAPTERS, SUMMARY_MODULE);
  assert.ok(baskakResults.some((r) => r.chapterId === 'ch-5'));

  const dolynskyiResults = searchStudyContent(
    'Долинський',
    CHAPTERS,
    SUMMARY_MODULE,
    24,
    ALL_VISUAL_SOURCES
  );
  assert.ok(dolynskyiResults.some((r) => r.targetType === 'visual' && r.visualId === 'vis-13-lev-1-portrait'));
});

test('filterFlashcards filters by chapter and unmastered state', () => {
  const mastered = new Set<string>(['fc-1-1', 'fc-1-2']);
  const ch1All = filterFlashcards(ALL_FLASHCARDS, 'ch-1', false, mastered);
  assert.equal(ch1All.length, 10);

  const ch1Unmastered = filterFlashcards(ALL_FLASHCARDS, 'ch-1', true, mastered);
  assert.equal(ch1Unmastered.length, 8);
  assert.ok(!ch1Unmastered.some((c) => c.id === 'fc-1-1'));
});

test('calculateProgressStats returns accurate percentages', () => {
  const stats = calculateProgressStats(
    100,
    new Set(['fc-1-1', 'fc-1-2', 'fc-2-1']),
    new Set(['ch-1', 'ch-2']),
    10
  );
  assert.equal(stats.masteredCount, 3);
  assert.equal(stats.cardsPercent, 3);
  assert.equal(stats.readCount, 2);
  assert.equal(stats.chaptersPercent, 20);
});
