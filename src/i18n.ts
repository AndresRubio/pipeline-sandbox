export type Lang = 'en' | 'es';

export interface Strings {
  heading: string;
  titlePlaceholder: string;
  authorPlaceholder: string;
  add: string;
  empty: string;
  by: string;
  remove: string;
  months: string[];
}

export const STRINGS: Record<Lang, Strings> = {
  en: {
    heading: 'Reading list',
    titlePlaceholder: 'Title',
    authorPlaceholder: 'Author',
    add: 'Add',
    empty: 'Your reading list is empty — add your first book above.',
    by: 'by',
    remove: 'Remove',
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  },
  es: {
    heading: 'Lista de lectura',
    titlePlaceholder: 'Título',
    authorPlaceholder: 'Autor',
    add: 'Añadir',
    empty: 'No hay libros.',
    by: 'de',
    remove: 'Quitar',
    months: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
  },
};

export const LANG_KEY = 'reading-list.lang';

export function resolveLang(stored: string | null, browser: string | undefined): Lang {
  if (stored === 'en' || stored === 'es') return stored;
  return browser?.toLowerCase().startsWith('es') ? 'es' : 'en';
}

export function loadLang(storage: Pick<Storage, 'getItem'>, browser: string | undefined): Lang {
  let stored: string | null = null;
  try {
    stored = storage.getItem(LANG_KEY);
  } catch {
    stored = null;
  }
  return resolveLang(stored, browser);
}

export function saveLang(storage: Pick<Storage, 'setItem'>, lang: Lang): void {
  try {
    storage.setItem(LANG_KEY, lang);
  } catch {
    // Storage unavailable: the language just won't be remembered.
  }
}
