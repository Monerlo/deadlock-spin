const DEMGG_API = 'https://demgg-api.dem.gg';
const DEMGG_CDN = 'https://cdn.dem.gg';

const MIN_ITEMS_FOR_VALID_BUILD = 4;

export interface DemGgItem {
  id: number;
  name: string;
  imageUrl: string | null;
}

export interface DemGgPlayer {
  playerId: number;
  playerName: string | null;
  playerSlug: string | null;
  heroId: number;
  heroName: string;
  heroImageUrl: string | null;
  mapNumber: number;
  teamId: number | null;
  kills: number;
  deaths: number;
  assists: number;
  souls: number;
  items: DemGgItem[];
}

export interface DemGgTeam {
  id: number;
  name: string;
  logoUrl: string | null;
}

export interface DemGgMapSummary {
  mapNumber: number;
  durationSeconds: number;
  killsA: number;
  killsB: number;
  netWorthA: number;
  netWorthB: number;
  winnerId: number | null;
  sidesConfirmed: boolean;
}

export interface DemGgMatch {
  id: number;
  teamA: DemGgTeam | null;
  teamB: DemGgTeam | null;
  event: { id: number; name: string; logoUrl: string | null } | null;
  scoreA: number;
  scoreB: number;
  winnerId: number | null;
  players: DemGgPlayer[];
  maps: DemGgMapSummary[];
}

export interface RandomBuild {
  match: DemGgMatch;
  player: DemGgPlayer;
}

// Відносні шляхи з dem.gg API (напр. /TeamLogos/abc.webp) → повний CDN URL
function toCdnUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return `${DEMGG_CDN}${url.startsWith('/') ? '' : '/'}${url}`;
}

function normalizeMatch(raw: DemGgMatch): DemGgMatch {
  return {
    ...raw,
    maps: raw.maps ?? [],
    teamA: raw.teamA ? { ...raw.teamA, logoUrl: toCdnUrl(raw.teamA.logoUrl) } : null,
    teamB: raw.teamB ? { ...raw.teamB, logoUrl: toCdnUrl(raw.teamB.logoUrl) } : null,
    event: raw.event ? { ...raw.event, logoUrl: toCdnUrl(raw.event.logoUrl) } : null,
    players: raw.players.map(p => ({
      ...p,
      heroImageUrl: toCdnUrl(p.heroImageUrl),
    })),
  };
}

function toSlug(str: string): string {
  return str
    .toLowerCase()
    .replace(/[''`]/g, '')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .trim()
    .replace(/\s+/g, '-');
}

export function matchUrl(match: DemGgMatch): string {
  const a = toSlug(match.teamA?.name ?? '');
  const b = toSlug(match.teamB?.name ?? '');
  const e = toSlug(match.event?.name ?? '');
  const slug = [a && b ? `${a}-vs-${b}` : '', e].filter(Boolean).join('-');
  return `https://dem.gg/matches/${match.id}${slug ? `/${slug}` : ''}`;
}

let _dlItemsCache: Map<number, { id: number; shop_image_webp?: string; image_webp?: string }> | null = null;

export async function getDlItemsMap(): Promise<Map<number, { id: number; shop_image_webp?: string; image_webp?: string }>> {
  if (_dlItemsCache) return _dlItemsCache;
  const res = await fetch('https://api.deadlock-api.com/v1/assets/items');
  const data = await res.json();
  _dlItemsCache = new Map(data.map((i: { id: number }) => [i.id, i]));
  return _dlItemsCache;
}

export async function fetchRandomBuild(heroName?: string): Promise<RandomBuild | null> {
  // Рандомний offset щоб показувати білди з різних частин архіву, не тільки свіжі
  const randomOffset = Math.floor(Math.random() * 400);
  let listRes = await fetch(`${DEMGG_API}/api/matches?status=completed&limit=100&offset=${randomOffset}`);
  if (!listRes.ok) return null;

  let matches: { id: number }[] = await listRes.json();

  // Якщо offset завеликий і список порожній — повертаємось до початку
  if (!matches.length) {
    listRes = await fetch(`${DEMGG_API}/api/matches?status=completed&limit=100&offset=0`);
    if (!listRes.ok) return null;
    matches = await listRes.json();
  }

  if (!matches.length) return null;

  const maxRetries = heroName ? 30 : 10;
  const shuffled = [...matches].sort(() => Math.random() - 0.5).slice(0, maxRetries);
  const nameFilter = heroName?.toLowerCase();

  for (const m of shuffled) {
    const detailRes = await fetch(`${DEMGG_API}/api/matches/${m.id}`);
    if (!detailRes.ok) continue;

    const raw: DemGgMatch = await detailRes.json();
    const detail = normalizeMatch(raw);

    const withItems = (detail.players ?? []).filter(p =>
      p.items?.length >= MIN_ITEMS_FOR_VALID_BUILD &&
      (nameFilter == null || p.heroName.toLowerCase() === nameFilter) &&
      p.playerName != null &&
      !p.playerSlug?.startsWith('u-')
    );
    if (!withItems.length) continue;

    const player = withItems[Math.floor(Math.random() * withItems.length)];
    return { match: detail, player };
  }

  return null;
}