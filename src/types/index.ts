export interface Hero {
  id: number;
  name: string;
  images: {
    icon_hero_card: string | null;
    icon_image_small: string | null;
    top_bar_vertical_image?: string | null;
  };
  player_selectable: boolean;
  disabled: boolean;
}

export interface Item {
  id: number;
  class_name: string; 
  name: string;
  item_tier: number | null;
  item_slot_type: string | null;
  shop_image_webp: string | null;
  image_webp: string | null;
  cost: number | null;
  shopable: boolean;
  type: string;
  disabled?: boolean | null;
  activation?: string | null;
  component_items?: string[] | null; 
}



export type Priority = 1 | 2 | 3;