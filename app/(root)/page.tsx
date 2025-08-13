// 'use client';
import ThreadCard from '@/components/cards/TreadCard';
import { fetchPosts } from '@/lib/actions/thread.action';
import { currentUser } from '@clerk/nextjs';
import { fetchUser } from '@/lib/actions/user.actions';
import PostThread from '@/components/forms/PostThread';

export default async function Home() {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  const result = await fetchPosts(1, 30);

  return (
    <>
      <h1 className="head-text text-left">Home</h1>

      <section className="mt-9 flex flex-col gap-10">
        {userInfo?.onboarded && (
          <div className="bg-dark-2 p-7 rounded-xl">
            <PostThread userId={userInfo._id.toString()} />
          </div>
        )}

        <div className="flex flex-col gap-10">
          {result.posts.length === 0 ? (
            <p className="no-result">No threads found</p>
          ) : (
            <>
              {result.posts.map((post) => (
                <ThreadCard
                  key={post._id}
                  id={post._id}
                  currentUserId={user.id}
                  parentId={post.parentId}
                  content={post.text}
                  author={post.author}
                  community={post.community}
                  createdAt={post.createdAt}
                  comments={post.children}
                  likes={post.likes}
                />
              ))}
            </>
          )}
        </div>
      </section>
    </>
  );
}
