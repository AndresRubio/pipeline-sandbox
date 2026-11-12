import { describe, expect, it } from 'vitest';
import { formatHeading, renderList } from './render';

describe('formatHeading', () => {
  it('shows zero items', () => {
    expect(formatHeading(0)).toBe('Reading list (0)');
  });

  it('shows one item', () => {
    expect(formatHeading(1)).toBe('Reading list (1)');
  });

  it('shows many items', () => {
    expect(formatHeading(12)).toBe('Reading list (12)');
  });
});

describe('renderList', () => {
  it('shows the empty state', () => {
    expect(renderList([])).toContain('No items.');
  });

  it('escapes titles', () => {
    const html = renderList([{ id: '1', title: '<b>x</b>', author: 'A', addedAt: '2026-03-01T10:00:00.000Z' }]);
    expect(html).toContain('&lt;b&gt;x&lt;/b&gt;');
  });

  it('shows the author in italics, escaped', () => {
    const html = renderList([{ id: '1', title: 'T', author: '<i>&', addedAt: '2026-03-01T10:00:00.000Z' }]);
    expect(html).toContain('<span class="author"><em>&lt;i&gt;&amp;</em></span>');
  });
});
