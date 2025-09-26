import { create } from 'zustand';

interface Item {
  itemId: string;
  itemName: string;
  parentItemId: string;
}

interface Level {
  levelId: string;
  levelName: string;
  items: Item[];
}

interface MultipleDropdownState {
  levels: Level[];
  addLevel: (level: Level) => void;
  updateLevel: (index: number, updatedLevel: Level) => void;
  removeLevel: (index: number) => void;
  addItemToLevel: (levelIndex: number, item: Item) => void;
  removeItemFromLevel: (levelIndex: number, itemIndex: number) => void;
}

export const MultipleDropdownStore = create<MultipleDropdownState>((set) => ({
  levels: [],

  addLevel: (level) => set((state) => ({
    levels: [...state.levels, level],
  })),

  updateLevel: (index, updatedLevel) => set((state) => {
    const updatedLevels = [...state.levels];
    updatedLevels[index] = updatedLevel;
    return { levels: updatedLevels };
  }),

  removeLevel: (index) => set((state) => {
    const updatedLevels = [...state.levels];
    const removedLevel = updatedLevels.splice(index, 1)[0];

    // Remove references to items from the removed level as parent
    updatedLevels.forEach((level, i) => {
      if (i >= index) {
        level.items = level.items.map(item => ({
          ...item,
          parentItemId: removedLevel.items.some(parent => parent.itemId === item.parentItemId)
            ? ''
            : item.parentItemId
        }));
      }
    });

    return { levels: updatedLevels };
  }),

  addItemToLevel: (levelIndex, item) => set((state) => {
    const updatedLevels = [...state.levels];
    updatedLevels[levelIndex].items.push(item);
    return { levels: updatedLevels };
  }),

  removeItemFromLevel: (levelIndex, itemIndex) => set((state) => {
    const updatedLevels = [...state.levels];
    const removedItem = updatedLevels[levelIndex].items.splice(itemIndex, 1)[0];

    // Remove references to the removed item as parent
    updatedLevels.forEach(level => {
      level.items = level.items.map(item => ({
        ...item,
        parentItemId: item.parentItemId === removedItem.itemId ? '' : item.parentItemId
      }));
    });

    return { levels: updatedLevels };
  }),
}));