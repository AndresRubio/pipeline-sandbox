import './style.css';
import { addItem, removeItem, type Item } from './list';
import { loadLang, saveLang, STRINGS } from './i18n';
import { formatHeading, renderList } from './render';
import { load, save } from './storage';

let items: Item[] = load(localStorage);
const listEl = document.querySelector<HTMLDivElement>('#list')!;
const headingEl = document.querySelector<HTMLHeadingElement>('h1')!;
const form = document.querySelector<HTMLFormElement>('#add-form')!;
const switchEl = document.querySelector<HTMLDivElement>('#lang-switch')!;
let lang = loadLang(localStorage, navigator.language);

function applyLang(): void {
  const t = STRINGS[lang];
  document.documentElement.lang = lang;
  document.title = t.heading;
  form.querySelector<HTMLInputElement>('[name=title]')!.placeholder = t.titlePlaceholder;
  form.querySelector<HTMLInputElement>('[name=author]')!.placeholder = t.authorPlaceholder;
  form.querySelector<HTMLButtonElement>('[type=submit]')!.textContent = t.add;
  switchEl.querySelectorAll<HTMLButtonElement>('button').forEach((b) => {
    b.setAttribute('aria-pressed', String(b.dataset.lang === lang));
  });
}

function refresh(): void {
  headingEl.textContent = formatHeading(items.length, lang);
  listEl.innerHTML = renderList(items, lang);
  save(localStorage, items);
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(form);
  items = addItem(
    items,
    { title: String(data.get('title') ?? ''), author: String(data.get('author') ?? '') },
    new Date(),
    crypto.randomUUID(),
  );
  form.reset();
  refresh();
});

listEl.addEventListener('click', (event) => {
  const target = event.target as HTMLElement;
  if (target.matches('button.remove') && target.dataset.id) {
    items = removeItem(items, target.dataset.id);
    refresh();
  }
});

switchEl.addEventListener('click', (event) => {
  const next = (event.target as HTMLElement).closest('button')?.dataset.lang;
  if (next !== 'en' && next !== 'es') return;
  lang = next;
  saveLang(localStorage, lang);
  applyLang();
  refresh();
});

applyLang();
refresh();
