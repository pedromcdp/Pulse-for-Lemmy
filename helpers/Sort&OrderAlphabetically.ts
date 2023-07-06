import type { CommunityView } from 'lemmy-js-client';

import type { IAlphabeticlyOrderedCommunities } from '@/hooks/useGetComunites';

export function SortAndOrderAlphabetically(
  communities: CommunityView[]
): IAlphabeticlyOrderedCommunities[] {
  const sorted = communities.reduce((acc, curr) => {
    const letter = curr.community.name[0]!.toUpperCase();
    if (!acc[letter]) {
      acc[letter] = [];
    }
    acc[letter]!.push(curr);
    return acc;
  }, {} as { [key: string]: CommunityView[] });

  return Object.keys(sorted)
    .map((key) => ({
      letter: key,
      data: sorted[key]!,
    }))
    .sort((a, b) => a.letter.localeCompare(b.letter));
}
