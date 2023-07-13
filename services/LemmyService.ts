/* eslint-disable import/no-mutable-exports */
import { PASSWORD, USERNAME } from '@env';
import { nativeApplicationVersion } from 'expo-application';
import type { Login } from 'lemmy-js-client';
import { LemmyHttp } from 'lemmy-js-client';
import { Platform } from 'react-native';

import Storage from './Storage';

const baseUrl = 'https://lemmy.world';
let LemmyClient: LemmyHttp;

let lemmyAuthToken: string | undefined;

interface Response {
  instance: string;
  username: string;
  jwt: string;
}

interface Error {
  error: string;
}

const connect = async (): Promise<Response | Error> => {
  LemmyClient = new LemmyHttp(baseUrl, {
    headers: {
      'User-Agent': `${Platform.OS.toUpperCase()}: com.pedromcdp.pulse v${nativeApplicationVersion}`,
    },
  });
  const loginForm: Login = {
    username_or_email: USERNAME,
    password: PASSWORD,
  };
  try {
    const activeAccount = await Storage.get('activeAccount');
    if (activeAccount !== null) {
      return activeAccount;
    }
    const { jwt } = await LemmyClient.login(loginForm);
    lemmyAuthToken = jwt;
    if (!lemmyAuthToken) {
      return { error: 'Error logging in' };
    }
    const account = {
      instance: baseUrl,
      username: USERNAME,
      jwt: lemmyAuthToken,
    };
    return account;
  } catch (error) {
    return { error: 'Error logging in' };
  }
};

export { connect, lemmyAuthToken, LemmyClient };
