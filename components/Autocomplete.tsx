'use client';

import React, { Fragment, createElement, useEffect, useRef } from 'react';
import { autocomplete, AutocompleteOptions } from '@algolia/autocomplete-js';
import { createRoot } from 'react-dom/client';

export default function Autocomplete({
  ...props
}: Omit<AutocompleteOptions<any>, 'container'>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRootRef = useRef<any | null>(null);
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) {
      return undefined;
    }

    const search = autocomplete({
      container: containerRef.current,
      renderer: { createElement, Fragment },
      render({ children }, root) {
        if (!panelRootRef.current || rootRef.current !== root) {
          rootRef.current = root;
          panelRootRef.current?.unmount();
          panelRootRef.current = createRoot(root);
        }

        panelRootRef.current.render(children);
      },
      ...props,
      insights: true,
    });

    return () => {
      search.destroy();
    };
  }, [props]);

  return <div ref={containerRef} />;
}
