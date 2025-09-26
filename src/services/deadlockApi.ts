const API_BASE_URL = "https://assets.deadlock-api.com";
export interface Hero {
  id: number;
  name: string;
  images: {
    icon_hero_card: string;
    icon_image_small: string;
  };
  player_selectable: boolean; 
  disabled: boolean;          
}

export async function fetchHeroes(): Promise<Hero[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/v2/heroes`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data: Hero[] = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch heroes:", error);
    return []; 
  }
}