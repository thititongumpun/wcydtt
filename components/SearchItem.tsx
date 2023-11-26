import React from 'react';
import { AutocompleteComponents } from '@algolia/autocomplete-js';

export default function SearchItem({
  hit,
  components,
}: {
  hit: any;
  components: AutocompleteComponents;
}) {
  return (
    <div className="aa-ItemContent">
      <div className="aa-ItemTitle">
        <components.Highlight hit={hit} attribute="title" />
      </div>
    </div>
  );
}
