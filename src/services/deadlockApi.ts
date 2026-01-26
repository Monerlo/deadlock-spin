import type { Hero, Item } from '../types';

const API_BASE_URL = "https://assets.deadlock-api.com";
const ASSETS_BASE_URL = "https://assets.deadlock-api.com/images/heroes";

export const SOULS_ICON_URL = "/Souls.webp";


export const HERO_IMAGE_OVERRIDES: Record<string, string> = {
  "Apollo": "https://assets-bucket.deadlock-api.com/assets-api-res/images/heroes/fencer_vertical.png",
  "Silver": "https://assets-bucket.deadlock-api.com/assets-api-res/images/heroes/werewolf_vertical.png",
  "Graves": "https://assets-bucket.deadlock-api.com/assets-api-res/images/heroes/necro_vertical.png",
  "Rem": "https://assets-bucket.deadlock-api.com/assets-api-res/images/heroes/familiar_vertical.png",
  "Celeste": "https://assets-bucket.deadlock-api.com/assets-api-res/images/heroes/unicorn_vertical.png",
  "Venator": "https://assets-bucket.deadlock-api.com/assets-api-res/images/heroes/priest_vertical.png"
};

const resolveImageUrl = (imageKey: string | null | undefined): string => {
  if (!imageKey) return '';
  if (imageKey.startsWith('http')) return imageKey;
  const fileName = imageKey.replace(/_png$/, '.png');
  return `${ASSETS_BASE_URL}/${fileName}`;
};

export async function fetchHeroes(): Promise<Hero[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/v2/heroes`);
    if (!response.ok) throw new Error('Network response was not ok');
    
    const rawData: Hero[] = await response.json();

    const processedData = rawData.map(hero => {
      let finalImageUrl = '';

      if (HERO_IMAGE_OVERRIDES[hero.name]) {
        finalImageUrl = HERO_IMAGE_OVERRIDES[hero.name];
      } else {
        const rawImageKey = (hero.images as any).top_bar_vertical_image 
                         || hero.images.icon_hero_card 
                         || hero.images.icon_image_small;
        
        finalImageUrl = resolveImageUrl(rawImageKey);
      }

      return {
        ...hero,
        images: {
          ...hero.images,
          icon_hero_card: finalImageUrl 
        }
      };
    });

    return processedData;
  } catch (error) {
    console.error("Failed to fetch heroes:", error);
    return [];
  }
}

export async function fetchItems(): Promise<Item[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/v2/items`);
    if (!response.ok) throw new Error('Network response was not ok');
    
    const data: Item[] = await response.json();
    
    
    return data.filter(item => 
      item.type === 'upgrade' && 
      item.shopable === true && 
      !item.disabled && 
      item.item_tier !== null && 
      item.item_tier >= 1 && 
      item.item_tier <= 4 && 
      (item.shop_image_webp || item.image_webp) &&
      
      (item.cost !== null && item.cost > 0 && item.cost < 9000)
    );
  } catch (error) {
    console.error("Failed to fetch items:", error);
    return [];
  }
}