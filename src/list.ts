import { STRINGS, type Lang } from './i18n';

export interface Item {
  id: string;
  title: string;
  author: string;
  addedAt: string;
}

export function addItem(items: Item[], input: { title: string; author: string }, now: Date, id: string): Item[] {
  const title = input.title.trim();
  const author = input.author.trim();
  if (!title || !author) throw new Error('title and author are required');
  return [...items, { id, title, author, addedAt: now.toISOString() }];
}

export function removeItem(items: Item[], id: string): Item[] {
  return items.filter((item) => item.id !== id);
}

export function sortByTitle(items: Item[]): Item[] {
  return [...items].sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }));
}

export function formatAdded(iso: string, lang: Lang = 'en'): string {
  const date = new Date(iso);
  return `${date.getUTCDate()} ${STRINGS[lang].months[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

export function countByAuthor(items: Item[]): Record<string, number> {
  const counts = new Map<string, number>();
  for (const { author } of items) {
    counts.set(author, (counts.get(author) ?? 0) + 1);
  }
  return Object.fromEntries(counts);
}
