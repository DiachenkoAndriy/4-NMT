import { CHAPTERS_1_TO_3 } from './chapters1to3';
import { CHAPTERS_4_TO_6 } from './chapters4to6';
import { CHAPTERS_7_TO_10 } from './chapters7to10';
import { MONUMENTS, SUMMARY_MODULE } from './summaryModule';
import { ALL_VISUAL_SOURCES } from './visualSources';
import { Chapter, FlashcardItem, StudyTable } from '../types/content';

export const CHAPTERS: Chapter[] = [
  ...CHAPTERS_1_TO_3,
  ...CHAPTERS_4_TO_6,
  ...CHAPTERS_7_TO_10,
];

export const ALL_FLASHCARDS: FlashcardItem[] = CHAPTERS.flatMap((ch) => ch.flashcards);

export interface ExtractedTableEntry {
  sourceLabel: string;
  chapterId: string;
  subsectionId: string;
  table: StudyTable;
}

export const ALL_TABLES: ExtractedTableEntry[] = [
  ...CHAPTERS.flatMap((ch) =>
    ch.subsections.flatMap((sub) =>
      sub.blocks
        .filter((b): b is Extract<typeof b, { type: 'table' }> => b.type === 'table')
        .map((b) => ({
          sourceLabel: `Розділ ${ch.number} · ${sub.title}`,
          chapterId: ch.id,
          subsectionId: sub.id,
          table: b.table,
        }))
    )
  ),
  ...SUMMARY_MODULE.sections.flatMap((sec) =>
    sec.blocks
      .filter((b): b is Extract<typeof b, { type: 'table' }> => b.type === 'table')
      .map((b) => ({
        sourceLabel: `Стислий конспект · ${sec.title}`,
        chapterId: 'summary',
        subsectionId: sec.id,
        table: b.table,
      }))
  ),
];

export { ALL_VISUAL_SOURCES, MONUMENTS, SUMMARY_MODULE };
