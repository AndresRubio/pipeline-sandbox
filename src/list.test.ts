import { describe, expect, it } from 'vitest';
import { addItem, countByAuthor, formatAdded, removeItem, sortByTitle, type Item } from './list';

const now = new Date('2026-03-01T10:00:00Z');

describe('addItem', () => {
  it('appends a trimmed item with the given id and time', () => {
    expect(addItem([], { title: '  Dune ', author: ' Frank Herbert ' }, now, 'a1')).toEqual([
      { id: 'a1', title: 'Dune', author: 'Frank Herbert', addedAt: '2026-03-01T10:00:00.000Z' },
    ]);
  });

  it('rejects a blank title', () => {
    expect(() => addItem([], { title: ' ', author: 'X' }, now, 'a1')).toThrow('title and author are required');
  });
});

describe('removeItem', () => {
  it('removes only the item with the id', () => {
    const items = addItem(addItem([], { title: 'A', author: 'X' }, now, '1'), { title: 'B', author: 'Y' }, now, '2');
    expect(removeItem(items, '1').map((i) => i.id)).toEqual(['2']);
  });
});

describe('sortByTitle', () => {
  const book = (id: string, title: string, author = 'X'): Item => ({
    id,
    title,
    author,
    addedAt: '2026-03-01T10:00:00.000Z',
  });

  it('orders titles alphabetically, ignoring case', () => {
    const sorted = sortByTitle([book('1', 'Zebra'), book('2', 'apple'), book('3', 'Mango')]);
    expect(sorted.map((i) => i.title)).toEqual(['apple', 'Mango', 'Zebra']);
  });

  it('keeps the added order for equal titles', () => {
    const sorted = sortByTitle([book('d1', 'Dune', 'A'), book('x', 'Axe'), book('d2', 'Dune', 'B'), book('d3', 'dune', 'C')]);
    expect(sorted.map((i) => i.id)).toEqual(['x', 'd1', 'd2', 'd3']);
  });

  it('does not change the order of its input', () => {
    const items = [book('1', 'Zebra'), book('2', 'apple')];
    sortByTitle(items);
    expect(items.map((i) => i.id)).toEqual(['1', '2']);
  });
});

describe('formatAdded', () => {
  it('shows the month the item was added in', () => {
    expect(formatAdded('2026-09-25T10:00:00.000Z')).toBe('25 Sep 2026');
  });

  it('shows December rather than undefined', () => {
    expect(formatAdded('2026-12-03T10:00:00.000Z')).toBe('3 Dec 2026');
  });

  it('shows January for the first month of the year', () => {
    expect(formatAdded('2026-01-15T10:00:00.000Z')).toBe('15 Jan 2026');
  });
});

describe('countByAuthor', () => {
  const byAuthor = (id: string, author: string): Item => ({
    id,
    title: 'Title',
    author,
    addedAt: '2026-03-01T10:00:00.000Z',
  });

  it('returns an empty object for no items', () => {
    expect(countByAuthor([])).toEqual({});
  });

  it('counts how many items each author has', () => {
    const items = [byAuthor('1', 'Le Guin'), byAuthor('2', 'Tolkien'), byAuthor('3', 'Le Guin')];
    expect(countByAuthor(items)).toEqual({ 'Le Guin': 2, Tolkien: 1 });
  });

  it('compares authors exactly as stored', () => {
    const items = [byAuthor('1', 'Le Guin'), byAuthor('2', 'le guin'), byAuthor('3', 'Le Guin ')];
    expect(countByAuthor(items)).toEqual({ 'Le Guin': 1, 'le guin': 1, 'Le Guin ': 1 });
  });
});
