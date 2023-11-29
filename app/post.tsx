import React from 'react';
import PostCard from '../components/PostCard';
import Pagination from '../components/Pagination';
import { getAllPostsPagination } from '../lib/cosmic';

export default async function PostList({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const page = searchParams?.page;
  const pageIndex = parseInt(page as string, 10) || 1;

  // Set the number of posts to be displayed per page
  const POSTS_PER_PAGE = 5;

  // Define the parameters for fetching posts based on the current page
  const params = {
    pageIndex: (pageIndex - 1) * POSTS_PER_PAGE,
    limit: POSTS_PER_PAGE,
  };

  const posts = await getAllPostsPagination(params);

  const isFirstPage = pageIndex < 2;
  const isLastPage = posts.length < POSTS_PER_PAGE;

  return (
    <main className="mx-auto mt-4 w-full max-w-3xl flex-col space-y-16 px-4 lg:px-0">
      {!posts && 'You must add at least one Post to your Bucket'}
      {posts && posts?.length === 0 && (
        <div className="flex h-40 items-center justify-center">
          <span className="text-lg text-gray-500">
            End of the result!
          </span>
        </div>
      )}
      {posts &&
        posts.map((post) => {
          return (
            <div key={post.id}>
              <PostCard post={post} />
            </div>
          );
        })}

      <Pagination
        pageIndex={pageIndex}
        isFirstPage={isFirstPage}
        isLastPage={isLastPage}
      />
    </main>
  );
}
