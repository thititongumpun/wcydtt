'use client';

import React from 'react';
import { getAlgoliaResults } from '@algolia/autocomplete-js';
import algoliasearch from 'algoliasearch/lite';
import Autocomplete from './Autocomplete';
import SearchItem from './SearchItem';
import { useRouter } from 'next/navigation';

type Props = {};

export const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APPID ?? '',
  process.env.NEXT_PUBLIC_ALGOLIA_APISECRET ?? ''
);

export default function Search({}: Props) {
  const router = useRouter();
  return (
    <Autocomplete
      placeholder="Search posts"
      classNames={{
        list: '',
        item: '',
        input: 'xl:w-full',
        label: '',
      }}
      getSources={({ query }: { query: string }) => [
        {
          sourceId: 'posts',
          getItems() {
            return getAlgoliaResults({
              searchClient,
              queries: [
                {
                  indexName: 'posts',
                  query,
                },
              ],
            });
          },
          onSelect({ item }) {
            router.push(`/posts/${item.slug}`);
          },

          templates: {
            item({ item, components }) {
              return <SearchItem hit={item} components={components} />;
            },
          },

          params: {
            attributesToSnippet: ['title'],
            hitsPerPage: 5,
            attributesToHighlight: ['title'],
          },
        },
      ]}
    />
  );
}
