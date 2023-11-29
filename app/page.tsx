import React, { Suspense } from 'react';
import PostList from './post';
import Loading from '../components/Loading';

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <main className="mx-auto mt-4 w-full max-w-3xl flex-col space-y-16 px-4 lg:px-0">
      <Suspense
        key={(searchParams?.page as string) || '1'}
        fallback={<Loading />}
      >
        <PostList searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

export const revalidate = 60;
