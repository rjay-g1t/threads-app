// 'use client';
import ThreadCard from '@/components/cards/TreadCard';
import { fetchPosts } from '@/lib/actions/thread.action';
import { currentUser } from '@clerk/nextjs';

export default async function Home() {
  const result = await fetchPosts(1, 30);
  const user = await currentUser();
  // const handleFetchUserThreads = async () => {
  //   const userId = await currentUser();
  //   const { id } = userId || { id: '' };
  //   const res = await fetchUsersThreads(id);
  //   console.log(res);
  // };

  // console.log(result);

  return (
    <main>
      <p className="text-lime-50">Home</p>
      <section className="mt-9 flex flex-col gap-10">
        {result.posts.length !== 0 ? (
          result.posts.map((post) => (
            <ThreadCard
              key={post._id}
              id={post._id}
              currentUserId={user?.id || ''}
              parentId={post.parentId}
              content={post.text}
              author={post.author}
              community={post.community}
              createdAt={post.createdAt}
              comments={post.children}
            />
          ))
        ) : (
          <p>No posts</p>
        )}
      </section>
    </main>
  );
}
