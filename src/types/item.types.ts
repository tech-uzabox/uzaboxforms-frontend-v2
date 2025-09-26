export interface ItemTypes {
  itemId: string;
  itemName: string;
  parentItemId: string;
}

export interface LevelTypes {
  levelId: string;
  levelName: string;
  items: ItemTypes[];
}
