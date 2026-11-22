import {
  Chapter,
  ContentBlock,
  FlashcardItem,
  ListItem,
  MonumentAsset,
  RichText,
  SummaryModule,
} from '../types/content';

export interface SearchResult {
  id: string;
  targetType: 'chapter' | 'summary' | 'flashcard' | 'visual';
  chapterId: string;
  subsectionId?: string;
  flashcardId?: string;
  visualId?: string;
  categoryLabel: string;
  title: string;
  snippet: string;
}

export function extractRichTextPlain(runs: RichText): string {
  return runs
    .map((run) => (typeof run === 'string' ? run : run.text))
    .join('');
}

function extractListItemPlain(item: ListItem): string {
  const main = extractRichTextPlain(item.content);
  const sub = (item.subItems ?? []).map(extractRichTextPlain).join(' ');
  return sub ? `${main} ${sub}` : main;
}

export function extractBlockPlain(block: ContentBlock): string {
  switch (block.type) {
    case 'paragraph':
    case 'subheading':
      return extractRichTextPlain(block.content);
    case 'bullets':
    case 'numbered':
      return block.items.map(extractListItemPlain).join(' ');
    case 'callout': {
      const title = block.title ? extractRichTextPlain(block.title) : '';
      const body = extractRichTextPlain(block.content);
      const items = (block.items ?? []).map(extractListItemPlain).join(' ');
      return [title, body, items].filter(Boolean).join(' ');
    }
    case 'table':
      return [
        block.table.title ?? '',
        block.table.headers.join(' '),
        ...block.table.rows.map((r) => r.cells.map(extractRichTextPlain).join(' ')),
      ]
        .filter(Boolean)
        .join(' ');
    case 'quotes':
      return block.items
        .map(
          (q) =>
            `${extractRichTextPlain(q.title)} ${extractRichTextPlain(q.quote)} ${extractRichTextPlain(q.markers)}`
        )
        .join(' ');
    case 'glossary':
      return block.items
        .map((g) => `${g.term} ${extractRichTextPlain(g.definition)}`)
        .join(' ');
    case 'monuments_gallery':
      return [
        block.intro ? extractRichTextPlain(block.intro) : '',
        block.detailsSummary ? extractRichTextPlain(block.detailsSummary) : '',
      ]
        .filter(Boolean)
        .join(' ');
  }
}

function buildSnippet(text: string, queryLower: string): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  const idx = clean.toLowerCase().indexOf(queryLower);
  if (idx === -1) {
    return clean.slice(0, 150) + (clean.length > 150 ? '…' : '');
  }
  const start = Math.max(0, idx - 55);
  const end = Math.min(clean.length, idx + queryLower.length + 95);
  const prefix = start > 0 ? '…' : '';
  const suffix = end < clean.length ? '…' : '';
  return `${prefix}${clean.slice(start, end)}${suffix}`;
}

export function searchStudyContent(
  rawQuery: string,
  chapters: Chapter[],
  summary: SummaryModule,
  limit = 24,
  visuals: MonumentAsset[] = []
): SearchResult[] {
  const query = rawQuery.trim().toLowerCase();
  if (query.length < 2) {
    return [];
  }

  const results: SearchResult[] = [];

  for (const vis of visuals) {
    const combined = `${vis.title} ${vis.caption} ${vis.visualFeature} ${vis.markerDetail} ${vis.trapDetail} ${vis.locationAndAuthor}`;
    if (combined.toLowerCase().includes(query)) {
      results.push({
        id: `res-${vis.id}`,
        targetType: 'visual',
        chapterId: vis.relatedChapterId ?? 'ch-1',
        visualId: vis.id,
        categoryLabel: 'Візуальне джерело',
        title: vis.title,
        snippet: buildSnippet(`${vis.caption} ${vis.markerDetail}`, query),
      });
    }
    if (results.length >= limit) return results;
  }

  for (const ch of chapters) {
    const introText = ch.intro.map(extractRichTextPlain).join(' ');
    if (ch.title.toLowerCase().includes(query) || introText.toLowerCase().includes(query)) {
      results.push({
        id: `res-${ch.id}`,
        targetType: 'chapter',
        chapterId: ch.id,
        categoryLabel: `Розділ ${ch.number}`,
        title: ch.title,
        snippet: buildSnippet(introText || ch.title, query),
      });
    }

    for (const sub of ch.subsections) {
      const subBody = sub.blocks.map(extractBlockPlain).join(' ');
      if (sub.title.toLowerCase().includes(query) || subBody.toLowerCase().includes(query)) {
        results.push({
          id: `res-${sub.id}`,
          targetType: 'chapter',
          chapterId: ch.id,
          subsectionId: sub.id,
          categoryLabel: `Розділ ${ch.number}`,
          title: sub.title,
          snippet: buildSnippet(subBody || sub.title, query),
        });
      }
      if (results.length >= limit) return results;
    }

    for (const fc of ch.flashcards) {
      const combined = `${fc.question} ${fc.answer}`;
      if (combined.toLowerCase().includes(query)) {
        results.push({
          id: `res-${fc.id}`,
          targetType: 'flashcard',
          chapterId: ch.id,
          flashcardId: fc.id,
          categoryLabel: `Флеш-картка · Розділ ${ch.number}`,
          title: fc.question,
          snippet: buildSnippet(fc.answer, query),
        });
      }
      if (results.length >= limit) return results;
    }
  }

  for (const sec of summary.sections) {
    const body = sec.blocks.map(extractBlockPlain).join(' ');
    if (sec.title.toLowerCase().includes(query) || body.toLowerCase().includes(query)) {
      results.push({
        id: `res-${sec.id}`,
        targetType: 'summary',
        chapterId: summary.id,
        subsectionId: sec.id,
        categoryLabel: 'Стислий конспект НМТ',
        title: sec.title,
        snippet: buildSnippet(body || sec.title, query),
      });
    }
    if (results.length >= limit) return results;
  }

  return results;
}

export function filterFlashcards(
  cards: FlashcardItem[],
  chapterFilter: string,
  onlyUnmastered: boolean,
  masteredIds: Set<string>
): FlashcardItem[] {
  return cards.filter((card) => {
    if (chapterFilter !== 'all' && card.chapterId !== chapterFilter) {
      return false;
    }
    if (onlyUnmastered && masteredIds.has(card.id)) {
      return false;
    }
    return true;
  });
}

export function calculateProgressStats(
  totalCards: number,
  masteredIds: Set<string>,
  readChapterIds: Set<string>,
  totalChapters: number
): {
  masteredCount: number;
  cardsPercent: number;
  readCount: number;
  chaptersPercent: number;
} {
  const masteredCount = masteredIds.size;
  const readCount = readChapterIds.size;
  return {
    masteredCount,
    cardsPercent: totalCards > 0 ? Math.round((masteredCount / totalCards) * 100) : 0,
    readCount,
    chaptersPercent: totalChapters > 0 ? Math.round((readCount / totalChapters) * 100) : 0,
  };
}
