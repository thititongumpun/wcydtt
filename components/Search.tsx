'use client';

import React from 'react';
import { getAlgoliaResults } from '@algolia/autocomplete-js';
import algoliasearch from 'algoliasearch/lite';
import Autocomplete from './Autocomplete';
import SearchItem from './SearchItem';

type Props = {};

export const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APPID || '',
  process.env.NEXT_PUBLIC_ALGOLIA_APISECRET || ''
);

export default function Search({}: Props) {
  return (
    <Autocomplete
      classNames={{
        list: '',
        item: '',
        input: 'xl:w-full',
        label: '',
        // button: 'placeholder:opacity-0',
      }}
      getSources={({ query }: { query: string }) => [
        {
          sourceId: 'products',
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
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          // onSelect({ item }) {
          //   // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          //   void router.push(`/products/${item.id}`);
          // },

          templates: {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            item({ item, components }) {
              return <SearchItem hit={item} components={components} />;
            },
          },

          params: {
            attributesToSnippet: ['slug'],
            hitsPerPage: 5,
            attributesToHighlight: ['slug'],
          },
        },
      ]}
    />
  );
}
