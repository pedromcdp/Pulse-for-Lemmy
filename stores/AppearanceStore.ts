import { create } from 'zustand';

import Storage from '@/services/Storage';

interface AppearanceStore {
  settings: AppearanceSettings;
  setSettings: (settings: AppearanceSettings) => void;
}

interface AppearanceSettings {
  showIcons: boolean;
  systemFont: boolean;
  systemColorMode: boolean;
  // darkMode: boolean;
}

export const useAppearanceStore = create<AppearanceStore>((set) => ({
  settings: {
    showIcons: false,
    systemFont: false,
    systemColorMode: false,
    // darkMode: false,
  },
  setSettings: (settings: AppearanceSettings) => {
    set({ settings });
    Storage.set('appearance', settings).then();
  },
  setSystemFont: (settings: AppearanceSettings) => {
    set({ settings });
    Storage.set('appearance', settings).then();
  },
}));
