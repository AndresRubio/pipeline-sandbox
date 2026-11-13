import { STRINGS, type Lang } from './i18n';
import { formatAdded, sortByTitle, type Item } from './list';

const ENTITIES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (c) => ENTITIES[c] ?? c);
}

export function renderList(items: Item[], lang: Lang = 'en'): string {
  const t = STRINGS[lang];
  if (items.length === 0) return `<p class="empty">${escapeHtml(t.empty)}</p>`;
  const rows = sortByTitle(items)
    .map(
      (item) =>
        `<li><span class="title">${escapeHtml(item.title)}</span> ${escapeHtml(t.by)} <span class="author"><em>${escapeHtml(item.author)}</em></span> ` +
        `<span class="added">${formatAdded(item.addedAt, lang)}</span> ` +
        `<button class="remove" data-id="${escapeHtml(item.id)}">${escapeHtml(t.remove)}</button></li>`,
    )
    .join('');
  return `<ul class="items">${rows}</ul>`;
}

export function formatHeading(count: number, lang: Lang = 'en'): string {
  return `${STRINGS[lang].heading} (${count})`;
}
