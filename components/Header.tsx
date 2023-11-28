import React from 'react';
import SiteLogo from './logos/SiteLogo';
import { GlobalData } from '../lib/types';
import dynamic from 'next/dynamic';

const Search = dynamic(() => import('./Search'))
const ThemeToggle = dynamic(() => import('./ThemeToggle'))

export default function Header({ name }: { name: GlobalData }): JSX.Element {
  return (
    <header className="sticky top-0 z-10 mx-auto bg-white/75 backdrop-blur-lg dark:bg-zinc-950/75">
      <SiteLogo siteData={name} />
      <div className="mx-auto flex w-full max-w-3xl items-center justify-center gap-2 px-4 py-4 lg:px-0">
        <Search />
        <ThemeToggle />
      </div>
    </header>
  );
}
