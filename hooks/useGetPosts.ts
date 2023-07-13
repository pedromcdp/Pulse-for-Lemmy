/* eslint-disable no-restricted-syntax */
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { Image } from 'expo-image';
import type {
  GetPostsResponse,
  ListingType,
  PostView,
  SortType,
} from 'lemmy-js-client';

import { prefetchImages } from '@/helpers/ImageHelper';
import { LemmyClient } from '@/services/LemmyService';

interface LemmyInifiniteQuery {
  posts: PostView[];
  page: number;
}

interface LemmyInifiniteGetQueryData {
  pageparams: number[];
  pages: LemmyInifiniteQuery[];
}

export const useGetPosts = (auth: string | undefined, page = 0) => {
  return useQuery<GetPostsResponse, ErrorConstructor>(
    ['userSavedPosts', auth],
    async () => {
      const response = await LemmyClient.getPosts({
        limit: 12,
        page,
        sort: 'Hot',
        type_: 'All',
      });
      return response;
    },
    {
      enabled: !!auth,
    }
  );
};

export const useGetPost = (
  post_id: number,
  auth?: string | undefined,
  comment_id?: number | undefined
) => {
  return useQuery<PostView, ErrorConstructor>(
    ['post', post_id],
    async () => {
      const response = await LemmyClient.getPost({
        auth,
        id: post_id,
        comment_id,
      });

      const post = response.post_view;
      return post;
    },
    {
      initialData: () => {
        const queryClient = useQueryClient();
        const data = queryClient.getQueryData<PostView>(['post', post_id]);
        return data;
      },
    }
  );
};

export const useGetAllPosts = (
  activeAccount?: string | undefined,
  community_id?: number | undefined,
  community_name?: string | undefined,
  sort: SortType = 'Hot',
  type_: ListingType = 'All'
) => {
  const queryClient = useQueryClient();
  return useInfiniteQuery<LemmyInifiniteQuery, ErrorConstructor>(
    ['Posts', activeAccount, community_id, community_name, sort, type_],
    async ({ pageParam = 1 }) => {
      const response = await LemmyClient.getPosts({
        auth: activeAccount,
        community_id,
        community_name,
        limit: 12,
        page: pageParam,
        sort,
        type_,
      });
      prefetchImages(response.posts);
      Image.clearMemoryCache();
      const removedDuplicatePosts = response.posts.filter((post) => {
        const posts = queryClient.getQueryData<LemmyInifiniteGetQueryData>([
          'Posts',
          activeAccount,
          community_id,
          community_name,
          sort,
          type_,
        ]);
        if (!posts) {
          return true;
        }
        if (pageParam === 1) {
          return true;
        }
        const currentPosts = posts.pages
          .map((p) => p.posts.map((p2) => p2.post.id))
          .flat(Infinity);

        return !currentPosts.includes(post.post.id);
      });
      response.posts = removedDuplicatePosts;
      const data = {
        posts: response.posts,
        page: pageParam,
      };
      removedDuplicatePosts.forEach((post) => {
        queryClient.setQueryData<PostView>(['post', post.post.id], post);
      });
      return data;
    },
    {
      keepPreviousData: true,
      getNextPageParam: (lastPage) => {
        if (lastPage.posts.length < 1) {
          return undefined;
        }
        return lastPage.page + 1;
      },
    }
  );
};