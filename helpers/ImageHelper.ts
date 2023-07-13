/* eslint-disable no-restricted-syntax */
import { Image } from 'expo-image';
import type { PostView } from 'lemmy-js-client';

import { ExtensionType, getLinkInfo } from './LinkHelper';

export const prefetchImages = async (posts: PostView[]): Promise<void> => {
  const images = [];

  for (const post of posts) {
    const info = getLinkInfo(post.post.url);

    if (info.extType === ExtensionType.IMAGE) {
      images.push(post.post.url);
    } else if (
      (info.extType === ExtensionType.VIDEO ||
        info.extType === ExtensionType.GENERIC) &&
      post.post.thumbnail_url
    ) {
      images.push(post.post.thumbnail_url);
    }
  }

  Image.prefetch(images as string[]);
};
