import { create } from 'zustand';

interface OrderStoreState {
  highlightedTableIds: number[];

  addHighlight: (tableId: number) => void;
  removeHighlight: (tableId: number) => void;
  clearHighlights: () => void;
}

export const useOrderStore = create<OrderStoreState>()((set) => ({
  highlightedTableIds: [],

  addHighlight: (tableId: number) =>
    set((state) => ({
      highlightedTableIds: state.highlightedTableIds.includes(tableId)
        ? state.highlightedTableIds
        : [...state.highlightedTableIds, tableId],
    })),

  removeHighlight: (tableId: number) =>
    set((state) => ({
      highlightedTableIds: state.highlightedTableIds.filter((id) => id !== tableId),
    })),

  clearHighlights: () => set({ highlightedTableIds: [] }),
}));
