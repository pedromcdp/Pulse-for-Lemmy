import { useQuery } from '@tanstack/react-query';
import type { CommunityView, ListingType, SortType } from 'lemmy-js-client';

import { LemmyClient } from '@/services/LemmyService';

export interface IAlphabeticlyOrderedCommunities {
  letter: string;
  data: CommunityView[];
}

interface IListComunities {
  auth?: string | undefined;
  type_?: ListingType | undefined;
  sort?: SortType | undefined;
  limit?: number | undefined;
  page?: number | undefined;
}

export const useListComunites = ({
  auth,
  type_,
  sort,
  limit,
  page,
}: IListComunities) => {
  return useQuery<CommunityView[], ErrorConstructor>(
    ['listComunites', auth, type_, sort, limit, page],
    async () => {
      const response = await LemmyClient.listCommunities({
        auth,
        type_,
        sort,
        limit,
        page,
      });
      return response.communities;
    }
  );
};

export const useSubcribedComunitesList = (jwt: string | undefined) => {
  return useQuery<CommunityView[], ErrorConstructor>(
    ['listComunites', jwt, 'Subscribed', 50],
    async () => {
      const response = await LemmyClient.listCommunities({
        auth: jwt,
        type_: 'Subscribed',
        limit: 50,
      });
      return response.communities;
    },
    {
      enabled: !!jwt,
    }
  );
};

/*

 { data: CommunityView[]; title: string }[] | undefined
  >(undefined);

   auth: lemmyAuthToken,
      type_: 'Subscribed',
      limit: 10,


        await LemmyClient.listCommunities({ sort: 'Active', limit: 5 })

*/
