import type { ListingType, SortType } from 'lemmy-js-client';
import { create } from 'zustand';

interface IFeedStore {
  activeType: ListingType;
  activeSort: SortType;
  setActiveType: (activeType: ListingType) => void;
  setActiveSort: (activeSort: SortType) => void;
}

export const useFeedStore = create<IFeedStore>((set) => ({
  activeType: 'Subscribed',
  activeSort: 'Hot',
  setActiveType: (activeType: ListingType) => set({ activeType }),
  setActiveSort: (activeSort: SortType) => set({ activeSort }),
}));
