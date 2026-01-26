import type { Item } from '../types';


export type ItemPhase = 'lane' | 'mid' | 'late';
export type ItemCategory = 'weapon' | 'vitality' | 'spirit';

export interface ClassifiedItem {
  item: Item;
  phase: ItemPhase;
  category: ItemCategory;
  isActive: boolean;
  isRevealed: boolean;
}


export const CATEGORY_COLORS: Record<ItemCategory, string> = {
  weapon: 'rgb(236, 152, 26)',
  vitality: 'rgb(124, 187, 30)',
  spirit: 'rgb(206, 145, 255)'
};


export const getPriceByTier = (tier: number | null | undefined): number => {
  const t = tier || 1;
  if (t === 1) return 800;
  if (t === 2) return 1600;
  if (t === 3) return 3200;
  if (t >= 4) return 6400; 
  return 800;
};

export const getItemBackground = (category: ItemCategory, tier: number | null | undefined): string => {
  const safeTier = Math.min(Math.max(tier || 1, 1), 4);
  return `https://game.deadlock.coach/vpk/panorama/images/shop/catalog/cards/card_backer_${category}_t${safeTier}.webp`;
};

export const getRomanTier = (tier: number | null | undefined): string => {
  const romans = ['I', 'II', 'III', 'IV', 'V'];
  return romans[(tier || 1) - 1];
};


const getItemCategory = (slotType: string | null | undefined): ItemCategory => {
  if (slotType === 'vitality') return 'vitality';
  if (slotType === 'spirit') return 'spirit';
  return 'weapon';
};

const getItemPhase = (tier: number): ItemPhase => {
  if (tier <= 2) return 'lane';
  if (tier === 3) return 'mid';
  return 'late';
};

const isActiveItem = (activation: string | null | undefined): boolean => {
  return !!activation && activation !== 'passive';
};

export const classifyItem = (item: Item): ClassifiedItem => {
  const tier = item.item_tier || 1;
  const category = getItemCategory(item.item_slot_type);
  const active = isActiveItem(item.activation);
  
  return {
    item,
    phase: getItemPhase(tier),
    category,
    isActive: active,
    isRevealed: false 
  };
};