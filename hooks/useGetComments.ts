import { useQuery } from '@tanstack/react-query';
import type { GetComments, GetCommentsResponse } from 'lemmy-js-client';

import { LemmyClient } from '@/services/LemmyService';

// interface LemmyInfiniteCommentsQuery extends GetCommentsResponse {
//   page: number;
// }

export const useGetComments = ({ post_id }: GetComments) => {
  return useQuery<GetCommentsResponse, ErrorConstructor>(
    ['comments', post_id],
    async () => {
      const response = await LemmyClient.getComments({
        post_id,
        max_depth: 10,
        sort: 'Top',
        type_: 'All',
      });
      return response;
    }
    // {
    //   getNextPageParam: (lastPage) => {
    //     if (lastPage.comments.length === 0) {
    //       return undefined;
    //     }
    //     return lastPage.page + 1;
    //   },
    // }
  );
};
