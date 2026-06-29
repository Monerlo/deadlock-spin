import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { fetchRandomBuild, matchUrl, type RandomBuild } from '../services/demGgApi';
import { useHeroesPool } from '../hooks/useHeroesPool';
import { HeroCard } from '../components/HeroCard';
import { RandomCard } from '../components/RandomCard';
import { classifyItem } from '../services/itemUtils';
import type { Hero, Item } from '../types';

const SOULS_ICON_URL = '/Souls.webp';

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function formatNetWorth(souls: number): string {
  return `${(souls / 1000).toFixed(1)}k`;
}

let _dlItemsCache: Map<number, Item> | null = null;
async function getDlItemsMap(): Promise<Map<number, Item>> {
  if (_dlItemsCache) return _dlItemsCache;
  const res = await fetch('https://api.deadlock-api.com/v1/assets/items');
  const data: Item[] = await res.json();
  _dlItemsCache = new Map(data.map(i => [i.id, i]));
  return _dlItemsCache;
}

export const BuildsPage = () => {
  const { allHeroes } = useHeroesPool();
  const [selectedHero, setSelectedHero] = useState<Hero | null>(null);
  const [pickerOpen, setPickerOpen] = useState(true);

  const [build, setBuild] = useState<RandomBuild | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [dlItemsMap, setDlItemsMap] = useState<Map<number, Item>>(new Map());

  useEffect(() => {
    getDlItemsMap()
      .then(setDlItemsMap)
      .catch(err => console.error('[BuildsPage] items fetch failed:', err));
  }, []);

  const load = async () => {
    setLoading(true);
    setError(false);
    setBuild(null);
    try {
      const result = await fetchRandomBuild(selectedHero?.name);
      if (!result) setError(true);
      else {
        setBuild(result);
        setPickerOpen(false);
      }
    } catch (err) {
      console.error('[BuildsPage] build fetch failed:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleHeroClick = (hero: Hero) => {
    setSelectedHero(prev => prev?.id === hero.id ? null : hero);
  };

  const { match, player } = build ?? {};

  const heroPortrait = player
    ? (allHeroes.find(h => h.name.toLowerCase() === player.heroName.toLowerCase())?.images.icon_hero_card
      ?? allHeroes.find(h => h.id === player.heroId)?.images.icon_hero_card
      ?? player.heroImageUrl)
    : null;

  const isWin = match?.winnerId != null && player?.teamId != null
    ? match.winnerId === player.teamId
    : null;

  const isPlayerTeamA = player?.teamId === match?.teamA?.id;
  const playerTeam  = isPlayerTeamA ? match?.teamA : match?.teamB;
  const oppTeam     = isPlayerTeamA ? match?.teamB : match?.teamA;
  const playerScore = isPlayerTeamA ? match?.scoreA : match?.scoreB;
  const oppScore    = isPlayerTeamA ? match?.scoreB : match?.scoreA;

  const mapSummary     = match?.maps?.find(m => m.mapNumber === player?.mapNumber) ?? null;
  const mapKillsPlayer = mapSummary ? (isPlayerTeamA ? mapSummary.killsA : mapSummary.killsB) : null;
  const mapKillsOpp    = mapSummary ? (isPlayerTeamA ? mapSummary.killsB : mapSummary.killsA) : null;
  const mapNwPlayer    = mapSummary ? (isPlayerTeamA ? mapSummary.netWorthA : mapSummary.netWorthB) : null;
  const mapNwOpp       = mapSummary ? (isPlayerTeamA ? mapSummary.netWorthB : mapSummary.netWorthA) : null;

  return (
    <div className="p-4 sm:p-6 lg:p-8 flex flex-col w-full relative z-10 font-sans">
      <Helmet>
        <title>Pro Build Randomizer — Competitive Deadlock Builds</title>
        <meta name="description" content="Random item builds from real competitive Deadlock matches. Powered by dem.gg esports archive." />
        <link rel="canonical" href="https://deadlockrandom.site/builds" />
      </Helmet>

      <div className="max-w-3xl mx-auto w-full space-y-4">

        <header className="text-center py-6 border-b border-[#2D2D2D]/50">
          <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-tight mb-2 text-white">
            Pro <span className="text-[#E19D37]">Build Randomizer</span>
          </h1>
          <p className="text-[#A0A0A0] text-xs md:text-sm">
            Real builds from competitive matches —{' '}
            <a href="https://dem.gg" target="_blank" rel="noopener noreferrer" className="text-[#E19D37] hover:underline">
              dem.gg
            </a>
          </p>
        </header>

        {/* ── Пікер героя ── */}
        <div className="bg-[#1a110e] border border-[#3d2b24] rounded-2xl overflow-hidden">

          {/* Заголовок пікера */}
          <button
            onClick={() => setPickerOpen(o => !o)}
            className="w-full px-5 py-3.5 flex items-center justify-between hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              {selectedHero ? (
                <>
                  <img
                    src={selectedHero.images.icon_hero_card ?? ''}
                    alt={selectedHero.name}
                    className="w-8 h-10 object-cover object-top rounded-md border border-[#E19D37]/50"
                  />
                  <div className="text-left">
                    <p className="text-[9px] uppercase tracking-[0.2em] text-[#505050] font-bold">Selected Hero</p>
                    <p className="text-white font-bold uppercase tracking-wide text-sm">{selectedHero.name}</p>
                  </div>
                </>
              ) : (
                <div className="text-left">
                  <p className="text-[9px] uppercase tracking-[0.2em] text-[#505050] font-bold">Hero Filter</p>
                  <p className="text-[#808080] text-sm font-bold">Any Hero</p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              {selectedHero && (
                <span
                  onClick={e => { e.stopPropagation(); setSelectedHero(null); }}
                  className="text-[10px] text-[#505050] hover:text-[#E19D37] uppercase tracking-wider font-bold transition-colors cursor-pointer px-2 py-1 rounded hover:bg-white/5"
                >
                  Clear
                </span>
              )}
              <span className="text-[#505050] text-xs">{pickerOpen ? '▲' : '▼'}</span>
            </div>
          </button>

          {/* Грід героїв */}
          {pickerOpen && (
            <div className="border-t border-[#3d2b24] p-3">
              <div className="grid grid-cols-[repeat(auto-fill,minmax(3.5rem,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(4rem,1fr))] gap-2">
                {allHeroes.map(hero => (
                  <HeroCard
                    key={hero.id}
                    hero={hero}
                    isSelected={selectedHero === null || selectedHero.id === hero.id}
                    onClick={handleHeroClick}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Кнопка Generate */}
          <div className="border-t border-[#3d2b24] px-5 py-3.5 flex justify-end">
            <button
              onClick={load}
              disabled={loading}
              className="px-8 py-2.5 bg-[#E19D37] hover:bg-[#c98a2d] disabled:bg-[#2D2D2D] disabled:opacity-50 text-black font-black rounded-lg transition-all shadow-[0_3px_0_0_#8e6120] active:translate-y-[1px] active:shadow-none uppercase tracking-widest text-sm"
            >
              {loading ? 'Searching...' : ' Get Build'}
            </button>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="w-10 h-10 border-4 border-[#E19D37] border-t-transparent rounded-full animate-spin" />
            <span className="text-[#505050] text-[10px] uppercase tracking-widest font-mono">
              {selectedHero ? `Looking for ${selectedHero.name} builds...` : 'Fetching build...'}
            </span>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="text-center py-12 bg-[#1a110e] border border-[#3d2b24] rounded-2xl">
            <p className="text-[#A0A0A0] text-sm mb-2">
              {selectedHero
                ? `No competitive builds found for ${selectedHero.name}.`
                : 'No build data for this match.'}
            </p>
            {selectedHero && (
              <p className="text-[#505050] text-xs mb-6">Try a different hero or leave it as Any.</p>
            )}
            <button onClick={load} className="px-8 py-3 bg-[#E19D37] hover:bg-[#c98a2d] text-black font-bold rounded-lg uppercase tracking-widest text-sm shadow-[0_3px_0_0_#8e6120] active:translate-y-[1px] active:shadow-none transition-all">
              Try Again
            </button>
          </div>
        )}

        {/* Build Card */}
        {build && !loading && match && player && (
          <div className="bg-[#1a110e] border border-[#3d2b24] rounded-2xl overflow-hidden shadow-2xl">

            {/* Хедер */}
            <div className="px-5 py-3 bg-black/40 border-b border-[#3d2b24] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                {match.event?.logoUrl && (
                  <img src={match.event.logoUrl} alt={match.event.name} className="w-6 h-6 object-contain flex-shrink-0" />
                )}
                <span className="text-[#A0A0A0] text-xs uppercase tracking-wider font-bold truncate">
                  {match.event?.name ?? 'Unknown Tournament'}
                </span>
              </div>
              {isWin !== null && (
                <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded flex-shrink-0 border ${
                  isWin ? 'bg-green-900/40 text-green-400 border-green-800/50' : 'bg-red-900/30 text-red-400 border-red-900/50'
                }`}>
                  {isWin ? 'WIN' : 'LOSS'}
                </span>
              )}
            </div>

            {/* Команди */}
            <div className="px-5 py-3 border-b border-[#3d2b24]/60 flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                {playerTeam?.logoUrl
                  ? <img src={playerTeam.logoUrl} alt={playerTeam.name} className="w-7 h-7 object-contain flex-shrink-0" />
                  : <span className="font-bold text-white text-sm truncate">{playerTeam?.name ?? 'TBD'}</span>
                }
                {playerTeam?.logoUrl && (
                  <span className="font-bold text-white text-sm truncate">{playerTeam.name}</span>
                )}
              </div>
              <span className="font-mono text-[#E19D37] font-bold text-base px-4 flex-shrink-0">{playerScore} : {oppScore}</span>
              <div className="flex items-center gap-2.5 min-w-0 justify-end">
                {oppTeam?.logoUrl && (
                  <span className="font-bold text-[#808080] text-sm truncate text-right">{oppTeam.name}</span>
                )}
                {oppTeam?.logoUrl
                  ? <img src={oppTeam.logoUrl} alt={oppTeam.name} className="w-7 h-7 object-contain flex-shrink-0" />
                  : <span className="font-bold text-[#808080] text-sm truncate text-right">{oppTeam?.name ?? 'TBD'}</span>
                }
              </div>
            </div>

            {/* Герой + Статистика */}
            <div className="flex h-48">
              <div className="relative w-32 sm:w-36 flex-shrink-0 bg-black/40">
                {heroPortrait ? (
                  <img src={heroPortrait} alt={player.heroName} className="absolute inset-0 w-full h-full object-cover object-top" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#505050] text-xs p-4 text-center">{player.heroName}</div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent px-3 py-2 z-10">
                  <p className="text-white text-[10px] font-bold uppercase tracking-widest truncate">{player.heroName}</p>
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-center gap-4 p-5">
                <div>
                  {player.playerSlug ? (
                    <a href={`https://dem.gg/players/${player.playerId}/${player.playerSlug}`} target="_blank" rel="noopener noreferrer"
                      className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight hover:text-[#E19D37] transition-colors leading-none block">
                      {player.playerName ?? `Player #${player.playerId}`}
                    </a>
                  ) : (
                    <span className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight leading-none block">
                      {player.playerName ?? `Player #${player.playerId}`}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[9px] uppercase tracking-[0.25em] text-[#505050] font-bold">K / D / A</span>
                  <div className="flex items-baseline gap-1.5 font-mono">
                    <span className="text-white font-bold text-3xl">{player.kills}</span>
                    <span className="text-[#3d2b24] text-xl">/</span>
                    <span className="text-red-400 font-bold text-3xl">{player.deaths}</span>
                    <span className="text-[#3d2b24] text-xl">/</span>
                    <span className="text-[#A0A0A0] font-bold text-3xl">{player.assists}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] uppercase tracking-[0.25em] text-[#505050] font-bold">Souls</span>
                    <div className="flex items-center gap-1.5">
                      <img src={SOULS_ICON_URL} alt="Souls" className="w-5 h-5" />
                      <span className="font-mono text-lg text-[#98FFDE] font-bold">{player.souls.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="w-px h-10 bg-[#3d2b24]" />
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] uppercase tracking-[0.25em] text-[#505050] font-bold">Map</span>
                    <span className="text-white font-bold text-lg font-mono">{player.mapNumber}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Стата карти */}
            {mapSummary && (
              <div className="border-t border-[#3d2b24]/60 bg-black/10 px-5 py-3 flex items-center gap-6 text-xs flex-wrap">
                <div className="flex items-center gap-1.5">
                  <span className="text-[#505050] uppercase tracking-wider font-bold">Duration</span>
                  <span className="text-white font-mono font-bold">{formatDuration(mapSummary.durationSeconds)}</span>
                </div>
                <div className="w-px h-4 bg-[#3d2b24]" />
                <div className="flex items-center gap-1.5">
                  <span className="text-[#505050] uppercase tracking-wider font-bold">Kills</span>
                  <span className="text-white font-mono font-bold">{mapKillsPlayer}</span>
                  <span className="text-[#505050]">—</span>
                  <span className="text-[#808080] font-mono">{mapKillsOpp}</span>
                </div>
                <div className="w-px h-4 bg-[#3d2b24]" />
                <div className="flex items-center gap-1.5">
                  <img src={SOULS_ICON_URL} alt="" className="w-3.5 h-3.5" />
                  <span className="text-[#505050] uppercase tracking-wider font-bold">Net Worth</span>
                  <span className="text-[#98FFDE] font-mono font-bold">{formatNetWorth(mapNwPlayer!)}</span>
                  <span className="text-[#505050]">—</span>
                  <span className="text-[#808080] font-mono">{formatNetWorth(mapNwOpp!)}</span>
                </div>
              </div>
            )}

            {/* Айтеми */}
            <div className="border-t border-[#3d2b24] bg-black/20 px-5 py-5">
              <p className="text-[9px] uppercase tracking-[0.25em] text-[#505050] font-bold mb-4">Build</p>
              <div className="flex flex-wrap gap-2.5">
                {player.items.map((demItem, i) => {
                  const fullItem = dlItemsMap.get(Number(demItem.id));
                  if (!fullItem) {
                    return <div key={`${demItem.id}-${i}`} className="w-[71px] h-[106.5px] rounded-[3px] bg-white/5 border border-white/10 animate-pulse" />;
                  }
                  return (
                    <RandomCard
                      key={`${demItem.id}-${i}`}
                      data={{ ...classifyItem(fullItem), isRevealed: true }}
                      onReveal={() => {}}
                    />
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-[#3d2b24] flex items-center justify-between gap-4">
              <a
                href={matchUrl(match)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#3d2b24] hover:border-[#E19D37]/50 hover:bg-white/5 transition-all group"
              >
                <img src="https://cdn.dem.gg/DEM.GGlogo.svg" alt="dem.gg" className="h-4 w-auto opacity-60 group-hover:opacity-100 transition-opacity" />
                <span className="text-[11px] text-[#808080] group-hover:text-[#E19D37] transition-colors uppercase tracking-wider font-bold">View Match</span>
              </a>
              <button
                onClick={load}
                className="px-8 py-2.5 bg-[#E19D37] hover:bg-[#c98a2d] text-black font-black rounded-lg transition-all shadow-[0_3px_0_0_#8e6120] active:translate-y-[1px] active:shadow-none uppercase tracking-widest text-sm"
              >
                New Build
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};