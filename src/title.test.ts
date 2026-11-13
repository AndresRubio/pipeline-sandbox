import { describe, expect, it } from 'vitest';
import html from '../index.html?raw';

describe('index.html', () => {
  it('has the page title "Reading list"', () => {
    const match = html.match(/<title>([^<]*)<\/title>/);
    expect(match?.[1]).toBe('Reading list');
  });

  it('has exactly one meta description "A small reading list."', () => {
    const tags = html.match(/<meta\s+name="description"[^>]*>/g) ?? [];
    expect(tags).toHaveLength(1);
    expect(tags[0]).toContain('content="A small reading list."');
  });
});
