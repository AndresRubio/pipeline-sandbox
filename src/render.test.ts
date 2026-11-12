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
    expect(renderList([])).toBe('<p class="empty">Your reading list is empty — add your first book above.</p>');
  });

  it('hides the empty state when there are items', () => {
    const html = renderList([{ id: '1', title: 'T', author: 'A', addedAt: '2026-03-01T10:00:00.000Z' }]);
    expect(html).not.toContain('Your reading list is empty');
    expect(html).toContain('<ul class="items">');
    expect(html).toContain('<span class="title">T</span>');
  });

  it('escapes titles', () => {
    const html = renderList([{ id: '1', title: '<b>x</b>', author: 'A', addedAt: '2026-03-01T10:00:00.000Z' }]);
    expect(html).toContain('&lt;b&gt;x&lt;/b&gt;');
  });

  describe('order', () => {
    const book = (id: string, title: string, author = 'A') => ({
      id,
      title,
      author,
      addedAt: '2026-03-01T10:00:00.000Z',
    });

    it('shows titles alphabetically', () => {
      const html = renderList([book('1', 'Zebra'), book('2', 'apple'), book('3', 'Mango')]);
      const at = (title: string) => html.indexOf(`>${title}<`);
      expect(at('apple')).toBeGreaterThan(-1);
      expect(at('apple')).toBeLessThan(at('Mango'));
      expect(at('Mango')).toBeLessThan(at('Zebra'));
    });

    it('keeps the added order for equal titles', () => {
      const html = renderList([book('1', 'Dune', 'First'), book('2', 'Axe'), book('3', 'Dune', 'Second')]);
      expect(html.indexOf('First')).toBeGreaterThan(-1);
      expect(html.indexOf('First')).toBeLessThan(html.indexOf('Second'));
    });

    it('pairs each Remove button with its own row when shown out of added order', () => {
      const html = renderList([book('z-id', 'Zebra'), book('a-id', 'apple')]);
      const rows = html.match(/<li>.*?<\/li>/g) ?? [];
      expect(rows).toHaveLength(2);
      expect(rows[0]).toContain('>apple<');
      expect(rows[0]).toContain('data-id="a-id"');
      expect(rows[1]).toContain('>Zebra<');
      expect(rows[1]).toContain('data-id="z-id"');
    });

    it('does not reorder the list it is given', () => {
      const items = [book('1', 'Zebra'), book('2', 'apple')];
      renderList(items);
      expect(items.map((i) => i.id)).toEqual(['1', '2']);
    });
  });

  it('shows the author in italics, escaped', () => {
    const html = renderList([{ id: '1', title: 'T', author: '<i>&', addedAt: '2026-03-01T10:00:00.000Z' }]);
    expect(html).toContain('<span class="author"><em>&lt;i&gt;&amp;</em></span>');
  });
});
