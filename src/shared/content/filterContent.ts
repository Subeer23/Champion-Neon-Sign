export function filterContent<T extends { title: string; summary: string }>(
  items: readonly T[],
  query: string,
  category = 'All',
): T[] {
  const normalized = query.trim().toLocaleLowerCase();
  return items.filter(
    item =>
      (category === 'All' || item.title === category) &&
      `${item.title} ${item.summary}`.toLocaleLowerCase().includes(normalized),
  );
}
