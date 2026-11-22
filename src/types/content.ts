export type TextRun =
  | string
  | {
      text: string;
      bold?: boolean;
      italic?: boolean;
    };

export type RichText = TextRun[];

export interface ListItem {
  content: RichText;
  subItems?: RichText[];
}

export interface TableRow {
  cells: RichText[];
  status?: 'correct' | 'trap' | 'warning';
}

export interface StudyTable {
  id: string;
  title?: string;
  headers: string[];
  rows: TableRow[];
}

export interface HistoricalQuote {
  id: string;
  title: RichText;
  quote: RichText;
  markersLabel?: string;
  markers: RichText;
}

export interface GlossaryItem {
  term: string;
  definition: RichText;
}

export interface FlashcardItem {
  id: string;
  chapterId: string;
  chapterTitle: string;
  number: number;
  question: string;
  answer: string;
}

export interface MonumentAsset {
  id: string;
  orderNumber?: string;
  category?: 'map' | 'portrait' | 'monument';
  relatedChapterId?: string;
  title: string;
  date: string;
  locationAndAuthor: string;
  imagePath: string;
  caption: string;
  markerDetail: string;
  trapDetail: string;
  visualFeature: string;
}

export type ContentBlock =
  | { type: 'paragraph'; content: RichText; dropCap?: boolean }
  | { type: 'subheading'; content: RichText }
  | { type: 'bullets'; items: ListItem[] }
  | { type: 'numbered'; items: ListItem[] }
  | { type: 'callout'; variant: 'trap' | 'important' | 'chronology'; title?: RichText; content: RichText; items?: ListItem[] }
  | { type: 'table'; table: StudyTable }
  | { type: 'quotes'; items: HistoricalQuote[] }
  | { type: 'glossary'; items: GlossaryItem[] }
  | { type: 'monuments_gallery'; intro?: RichText; detailsSummary?: RichText };

export interface Subsection {
  id: string;
  title: string;
  blocks: ContentBlock[];
}

export interface Chapter {
  id: string;
  number: number;
  shortTitle: string;
  title: string;
  period: string;
  intro: RichText[];
  subsections: Subsection[];
  flashcards: FlashcardItem[];
}

export interface SummarySection {
  id: string;
  title: string;
  blocks: ContentBlock[];
}

export interface SummaryModule {
  id: string;
  title: string;
  intro: RichText;
  sections: SummarySection[];
}

export type AppView = 'reader' | 'summary' | 'visuals' | 'flashcards';
