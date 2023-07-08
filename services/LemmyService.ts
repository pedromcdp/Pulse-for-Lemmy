/* eslint-disable import/no-mutable-exports */
import { PASSWORD, USERNAME } from '@env';
import { nativeApplicationVersion } from 'expo-application';
import type { Login } from 'lemmy-js-client';
import { LemmyHttp } from 'lemmy-js-client';
import { Platform } from 'react-native';

const baseUrl = 'https://lemmy.world';
let LemmyClient: LemmyHttp;

let lemmyAuthToken: string | undefined;

const connect = async (): Promise<Boolean> => {
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
    const { jwt } = await LemmyClient.login(loginForm);
    lemmyAuthToken = jwt;
    console.log('logged in');
    return true;
  } catch (error) {
    console.log('error', error);
    return false;
  }
};

export { connect, lemmyAuthToken, LemmyClient };
