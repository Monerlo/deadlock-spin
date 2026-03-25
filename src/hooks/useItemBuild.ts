import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { fetchItems } from '../services/deadlockApi';
import { classifyItem, getPriceByTier, type ClassifiedItem } from '../services/itemUtils';
import type { Item } from '../types';

interface RandomBuildState {
  lane: ClassifiedItem[];
  mid: ClassifiedItem[];
  late: ClassifiedItem[];
  active: ClassifiedItem[];
}


function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export const useItemBuild = () => {
  const [allItems, setAllItems] = useState<Item[]>([]);
  const [itemMap, setItemMap] = useState<Record<string, Item>>({});
  const [randomBuild, setRandomBuild] = useState<RandomBuildState | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  
  const randomBuildRef = useRef<RandomBuildState | null>(null);

  useEffect(() => {
      randomBuildRef.current = randomBuild;
  }, [randomBuild]);

  
  useEffect(() => {
    const loadItems = async () => {
      try {
        const data = await fetchItems();
        setAllItems(data);
        const map: Record<string, Item> = {};
        data.forEach(item => { if (item.class_name) map[item.class_name] = item; });
        setItemMap(map);
        generateRandomBuild(data, map);
      } catch (error) {
        console.error("Failed to fetch items:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadItems();
  }, []);

 
  const totalSouls = useMemo(() => {
    if (!randomBuild) return 0;
    
    const sections = [...randomBuild.lane, ...randomBuild.mid, ...randomBuild.late, ...randomBuild.active];
    
    const revealedItems = sections.filter(i => i.isRevealed);
    return revealedItems.reduce((sum, item) => sum + getPriceByTier(item.item.item_tier), 0);
  }, [randomBuild]);

  const allRevealed = useMemo(() => {
    if (!randomBuild) return false;
    const sections = [...randomBuild.lane, ...randomBuild.mid, ...randomBuild.late, ...randomBuild.active];
    return sections.every(item => item.isRevealed);
  }, [randomBuild]);

 
  const generateRandomBuild = useCallback((items: Item[] = allItems, map: Record<string, Item> = itemMap) => {
    if (items.length === 0) return;

    const blockedItemIds = new Set<number>();
    const blockItemAndComponents = (item: Item) => {
      blockedItemIds.add(item.id);
      if (item.component_items?.length) {
        item.component_items.forEach(cName => {
          const comp = map[cName];
          if (comp) blockedItemIds.add(comp.id);
        });
      }
    };

    const pickRaw = (pool: Item[], count: number): Item[] => {
      const available = pool.filter(i => !blockedItemIds.has(i.id));
      return shuffleArray(available).slice(0, count);
    };

    const activePool = items.filter(i => i.activation && i.activation !== 'passive');
    const passivePool = items.filter(i => !i.activation || i.activation === 'passive');
    const tier4Pool = passivePool.filter(i => (i.item_tier || 1) >= 4);
    const tier3Pool = passivePool.filter(i => (i.item_tier || 1) === 3);
    const tier12Pool = passivePool.filter(i => (i.item_tier || 1) <= 2);

    const activeCount = Math.floor(Math.random() * 4) + 1;
    const remainingSlots = 12 - activeCount;
    const lateCount = Math.floor(remainingSlots / 3);
    const midCount = Math.round(remainingSlots / 3);
    const laneCount = remainingSlots - lateCount - midCount;

    const activeItems = pickRaw(activePool, activeCount);
    activeItems.forEach(blockItemAndComponents);

    let lateItemsRaw = [...pickRaw(tier4Pool, 1)];
    lateItemsRaw.forEach(blockItemAndComponents);
    if (lateCount > 1) {
      const fillers = pickRaw(passivePool, lateCount - 1);
      fillers.forEach(blockItemAndComponents);
      lateItemsRaw.push(...fillers);
    }

    const midItemsRaw = pickRaw(tier3Pool, midCount);
    midItemsRaw.forEach(blockItemAndComponents);

    const triggerRush = Math.random() < 0.15;
    let laneItemsRaw: Item[] = [];
    const MAX_LANE_COST = 10000;

    if (triggerRush && laneCount > 0) {
      const rushCandidates = pickRaw(tier4Pool, 1);
      if (rushCandidates.length > 0) {
        const rushItem = rushCandidates[0];
        blockItemAndComponents(rushItem);
        laneItemsRaw.push(rushItem);

        const neededFillers = laneCount - 1;
        if (neededFillers > 0) {
           let availableFillers = shuffleArray(tier12Pool.filter(i => !blockedItemIds.has(i.id)));
           let currentFillers = availableFillers.slice(0, neededFillers);
           
           const getCost = (l: Item[]) => l.reduce((s, i) => s + getPriceByTier(i.item_tier), 0);
           let currentTotal = getCost([rushItem, ...currentFillers]);
           let unusedFillers = availableFillers.slice(neededFillers);

           while (currentTotal > MAX_LANE_COST) {
               const expIdx = currentFillers.findIndex(i => getPriceByTier(i.item_tier) > 500);
               const cheapIdx = unusedFillers.findIndex(i => getPriceByTier(i.item_tier) <= 500);
               if (expIdx === -1 || cheapIdx === -1) break;
               currentFillers[expIdx] = unusedFillers[cheapIdx];
               unusedFillers.splice(cheapIdx, 1); 
               currentTotal = getCost([rushItem, ...currentFillers]);
           }
           currentFillers.forEach(blockItemAndComponents);
           laneItemsRaw.push(...currentFillers);
        }
      } else {
        const fillers = pickRaw(tier12Pool, laneCount);
        fillers.forEach(blockItemAndComponents);
        laneItemsRaw.push(...fillers);
      }
    } else {
      const fillers = pickRaw(tier12Pool, laneCount);
      fillers.forEach(blockItemAndComponents);
      laneItemsRaw.push(...fillers);
    }

    setRandomBuild({
      lane: shuffleArray(laneItemsRaw).map(classifyItem),
      mid: midItemsRaw.map(classifyItem),
      late: shuffleArray(lateItemsRaw).map(classifyItem),
      active: activeItems.map(classifyItem),
    });
  }, [allItems, itemMap]);

  
  const handleReveal = useCallback((itemToReveal: ClassifiedItem) => {
    setRandomBuild(prev => {
      if (!prev) return null;
      const updateList = (list: ClassifiedItem[]) => 
         list.map(i => i.item.id === itemToReveal.item.id ? { ...i, isRevealed: true } : i);
      return {
        lane: updateList(prev.lane),
        mid: updateList(prev.mid),
        late: updateList(prev.late),
        active: updateList(prev.active)
      };
    });
  }, []);

  
  const revealAll = useCallback(() => {
    const currentBuild = randomBuildRef.current;
    if (!currentBuild) return;

    
    const getSortedPhase = (baseItems: ClassifiedItem[], activeItems: ClassifiedItem[], phaseFilter: string) => {
       const relevantActives = activeItems.filter(i => i.phase === phaseFilter);
       return [...baseItems, ...relevantActives].sort((a, b) => (a.item.cost || 0) - (b.item.cost || 0));
    };

    
    const allItemsInOrder = [
      ...getSortedPhase(currentBuild.lane, currentBuild.active, 'lane'),
      ...getSortedPhase(currentBuild.mid, currentBuild.active, 'mid'),
      ...getSortedPhase(currentBuild.late, currentBuild.active, 'late'),
    ];

    
    const DELAY_MS = 150; 
    let delayIndex = 0;

    allItemsInOrder.forEach((item) => {
      if (!item.isRevealed) {
        setTimeout(() => {
           
           handleReveal(item);
        }, delayIndex * DELAY_MS);
        delayIndex++;
      }
    });
  }, [handleReveal]); 

  return {
    randomBuild,
    isLoading,
    totalSouls,
    allRevealed,
    generateRandomBuild: () => generateRandomBuild(allItems, itemMap),
    handleReveal,
    revealAll
  };
};