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

export type Priority = 1 | 2 | 3;