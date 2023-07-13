import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

import Storage from '@/services/Storage';

interface IAccountsStore {
  accounts: IAccount[];
  activeAccount: IAccount | undefined;
  addAccount: (account: IAccount) => void;
  removeAccount: (account: IAccount) => void;
  setActiveAccount: (account: IAccount | undefined) => void;
}

interface IAccount {
  instance: string;
  username: string;
  jwt: string;
}

export const useAccountsStore = create<IAccountsStore>((set) => ({
  accounts: [],
  activeAccount: undefined,
  addAccount: (account: IAccount) => {
    set((state) => ({
      accounts: [...state.accounts, account],
    }));
    Storage.set('accounts', account).then();
  },
  removeAccount: (account: IAccount) => {
    set((state) => ({
      accounts: state.accounts.filter(
        (acc) => acc.instance !== account.instance
      ),
    }));
    Storage.set('accounts', account).then();
  },
  setActiveAccount: (account: IAccount | undefined) => {
    set({ activeAccount: account });
    if (account === undefined) {
      AsyncStorage.removeItem('activeAccount').then();
    } else {
      Storage.set('activeAccount', account).then();
    }
  },
}));
