import { describe, expect, it } from 'vitest';
import { addItem, formatAdded, removeItem } from './list';

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
