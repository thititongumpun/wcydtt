import React from 'react';
import { Category } from '../lib/types';

function CategoryList({ categories }: { categories: Category[] }) {
  return (
    <section className="p-2">
      <div className="mx-auto max-w-screen-xl px-4 md:px-8">
        <div className="flex justify-center">
          <ul className="inline-grid grid-cols-3 gap-x-10 gap-y-2 md:grid-cols-3 md:gap-x-16 lg:grid-cols-6">
            {categories.map((category) => (
              <li key={category.slug}>
                {/* <Link
                  href={`/category/${category.slug}`}
                  className="text-sm font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
                > */}
                {category.slug}
                {/* </Link> */}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default CategoryList;
