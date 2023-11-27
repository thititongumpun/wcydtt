import { MetadataRoute } from 'next'
import { getAllPosts } from '../lib/cosmic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://wcydtt.co'

  const posts = await getAllPosts();
  const postsUrls = posts.map((post) => {
    return {
      url: `${baseUrl}/posts/${post.slug}`,
      lastModified: new Date()
    }
  })
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    ...postsUrls,
  ]
}