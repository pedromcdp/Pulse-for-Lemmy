import { useQuery } from '@tanstack/react-query';
import type { GetPersonDetailsResponse } from 'lemmy-js-client';

import { LemmyClient } from '@/services/LemmyService';
import { get } from '@/services/Storage';

export const useGetUserDetails = (username: string) => {
  return useQuery<GetPersonDetailsResponse, ErrorConstructor>(
    ['userDetails', username],
    async () => {
      const response = await LemmyClient.getPersonDetails({
        username,
      });
      return response;
    },
    {
      initialData: () => {
        try {
          get('user')
            .then((res) => JSON.parse(res))
            .then((res) => {
              return res;
            });
        } catch (error) {
          return undefined;
        }
        return undefined;
      },
    }
  );
};
