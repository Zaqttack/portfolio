import { getPosts } from '@/lib/db';
import type { Post } from '@/types';
import WritingClient from './WritingClient';

export default async function WritingPage() {
  let posts: Post[] = [];
  try {
    posts = await getPosts();
  } catch {
    // DB not available — show empty state
  }
  return <WritingClient posts={posts} />;
}
