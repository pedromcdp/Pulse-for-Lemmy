import { useQuery } from '@tanstack/react-query';
import type {
  GetPersonDetailsResponse,
  GetPostsResponse,
  GetUnreadCountResponse,
} from 'lemmy-js-client';

import { LemmyClient } from '@/services/LemmyService';

export const useGetUserDetails = (
  auth: string | undefined,
  username: string | undefined,
  person_id?: number | undefined
) => {
  return useQuery<GetPersonDetailsResponse, ErrorConstructor>(
    ['userDetails', username],
    async () => {
      const response = await LemmyClient.getPersonDetails({
        auth,
        username,
        person_id,
      });
      return response;
    },
    {
      enabled: username !== undefined,
    }
  );
};

export const useGetUserUnreadCount = (auth: string | undefined) => {
  return useQuery<GetUnreadCountResponse, ErrorConstructor>(
    ['userUnreadCount', auth],
    async () => {
      const response = await LemmyClient.getUnreadCount({
        auth: auth!,
      });
      return response;
    },
    {
      enabled: !!auth,
      // refetchInterval: 1000 * 60 * 1, // activate in production
    }
  );
};

export const useGetUserSavedPosts = (auth: string | undefined, page = 0) => {
  return useQuery<GetPostsResponse, ErrorConstructor>(
    ['userSavedPosts', auth],
    async () => {
      const response = await LemmyClient.getPosts({
        auth: auth!,
        saved_only: true,
        limit: 12,
        page,
      });
      return response;
    },
    {
      enabled: !!auth,
    }
  );
};
