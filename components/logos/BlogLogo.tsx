import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { GlobalData } from '../../lib/types';

export default function BlogLogo({
  className,
  siteData,
}: {
  className: string;
  siteData: GlobalData;
}): JSX.Element {
  return (
    <>
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center justify-between px-4 py-4 md:flex-row lg:px-0">
        <h1 className="flex space-x-2">
          <Image
            src="/blog.png"
            alt="wcydtt"
            height={100}
            width={100}
            className={className}
          />
          <Link
            href="/"
            className="bg-gradient-to-r from-cyan-700 to-teal-600 bg-clip-text text-4xl font-bold tracking-tighter text-transparent dark:from-cyan-300 dark:to-teal-200"
          >
            {siteData.metadata.site_title}
          </Link>
        </h1>
        <span className="relative hidden text-lg tracking-wide text-zinc-500 dark:text-zinc-200 md:flex">
          {siteData.metadata.site_tag}
        </span>
      </div>
    </>
  );
}
