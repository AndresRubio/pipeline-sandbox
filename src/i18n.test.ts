import { describe, expect, it } from 'vitest';
import { LANG_KEY, STRINGS, loadLang, resolveLang, saveLang } from './i18n';

function fakeStorage(initial: Record<string, string> = {}) {
  const map = new Map<string, string>(Object.entries(initial));
  return {
    getItem: (key: string) => map.get(key) ?? null,
    setItem: (key: string, value: string) => {
      map.set(key, value);
    },
  };
}

const throwingStorage = {
  getItem: (): string | null => {
    throw new Error('storage unavailable');
  },
  setItem: (): void => {
    throw new Error('storage unavailable');
  },
};

describe('STRINGS', () => {
  it('has the Spanish texts', () => {
    expect(STRINGS.es).toEqual({
      heading: 'Lista de lectura',
      titlePlaceholder: 'Título',
      authorPlaceholder: 'Autor',
      add: 'Añadir',
      empty: 'No hay libros.',
      by: 'de',
      remove: 'Quitar',
      months: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
    });
  });

  it('keeps the current English texts', () => {
    expect(STRINGS.en).toEqual({
      heading: 'Reading list',
      titlePlaceholder: 'Title',
      authorPlaceholder: 'Author',
      add: 'Add',
      empty: 'Your reading list is empty — add your first book above.',
      by: 'by',
      remove: 'Remove',
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    });
  });
});

describe('resolveLang', () => {
  it('prefers a valid stored language', () => {
    expect(resolveLang('es', 'en-US')).toBe('es');
    expect(resolveLang('en', 'es-ES')).toBe('en');
  });

  it('falls back to the browser language', () => {
    expect(resolveLang(null, 'es-MX')).toBe('es');
    expect(resolveLang(null, 'ES')).toBe('es');
    expect(resolveLang(null, 'en-GB')).toBe('en');
    expect(resolveLang(null, undefined)).toBe('en');
  });

  it('ignores an unknown stored value', () => {
    expect(resolveLang('fr', 'es-ES')).toBe('es');
    expect(resolveLang('fr', 'en')).toBe('en');
  });
});

describe('loadLang and saveLang', () => {
  it('uses the reading-list.lang key', () => {
    expect(LANG_KEY).toBe('reading-list.lang');
    const storage = fakeStorage();
    saveLang(storage, 'es');
    expect(storage.getItem('reading-list.lang')).toBe('es');
  });

  it('round trips the language', () => {
    const storage = fakeStorage();
    saveLang(storage, 'es');
    expect(loadLang(storage, 'en-US')).toBe('es');
    saveLang(storage, 'en');
    expect(loadLang(storage, 'es-ES')).toBe('en');
  });

  it('uses the browser language when nothing is stored', () => {
    expect(loadLang(fakeStorage(), 'es-ES')).toBe('es');
    expect(loadLang(fakeStorage(), 'en-US')).toBe('en');
  });

  it('survives a storage that throws', () => {
    expect(loadLang(throwingStorage, 'es-ES')).toBe('es');
    expect(loadLang(throwingStorage, 'en-US')).toBe('en');
    expect(() => saveLang(throwingStorage, 'es')).not.toThrow();
  });
});
