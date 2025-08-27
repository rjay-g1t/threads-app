import ThreadCard from '@/components/cards/TreadCard';
import { fetchPosts } from '@/lib/actions/thread.action';
import { currentUser } from '@clerk/nextjs';
import { fetchUser } from '@/lib/actions/user.actions';
import PostThread from '@/components/forms/PostThread';
import PublicPostThread from '@/components/forms/PublicPostThread';

export default async function Home() {
  const user = await currentUser();
  const result = await fetchPosts(1, 30);

  let userInfo = null;
  if (user) {
    userInfo = await fetchUser(user.id);
  }

  return (
    <>
      <h1 className="head-text text-left">Home</h1>

      <section className="mt-9 flex flex-col gap-10">
        {/* Show different post components based on auth status */}
        <div className="bg-dark-2 p-7 rounded-xl">
          {user && userInfo?.onboarded ? (
            <PostThread userId={userInfo._id.toString()} />
          ) : (
            <PublicPostThread />
          )}
        </div>

        <div className="flex flex-col gap-10">
          {result.posts.length === 0 ? (
            <p className="no-result">No threads found</p>
          ) : (
            <>
              {result.posts.map((post) => (
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
                  likes={post.likes}
                  likedBy={post.likedBy}
                  isPublicView={!user}
                />
              ))}
            </>
          )}
        </div>
      </section>
    </>
  );
}
