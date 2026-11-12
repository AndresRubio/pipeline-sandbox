import { describe, expect, it } from 'vitest';
import html from '../index.html?raw';

describe('index.html', () => {
  it('has the page title "Reading list"', () => {
    const match = html.match(/<title>([^<]*)<\/title>/);
    expect(match?.[1]).toBe('Reading list');
  });
});
