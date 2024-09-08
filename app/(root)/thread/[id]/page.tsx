import ThreadCard from '@/components/cards/TreadCard';
import Comment from '@/components/forms/CommentForm';
import { fethThreadById } from '@/lib/actions/thread.action';
import { fetchUser } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

const Page = async ({ params }: { params: { id: string } }) => {
  if (!params.id) return null;
  const user = await currentUser();
  const userInfo = await fetchUser(user?.id || '');

  if (!userInfo?.onboarded) return redirect('/onboarding');

  const thread = await fethThreadById(params.id);

  return (
    <section className="relative">
      <div>
        <ThreadCard
          key={thread._id}
          id={thread._id}
          currentUserId={user?.id || ''}
          parentId={thread.parentId}
          content={thread.text}
          author={thread.author}
          community={thread.community}
          createdAt={thread.createdAt}
          comments={thread.children}
        />
      </div>
      <div className="mt-7">
        <Comment
          threadId={thread.id}
          currentUserImage={user?.imageUrl || ''}
          currentUserId={userInfo._id}
        />
      </div>
      <div className="mt-10">
        {thread.children.map((comment: any) => (
          <ThreadCard
            key={comment._id}
            id={comment._id}
            currentUserId={user?.id || ''}
            parentId={comment.parentId}
            content={comment.text}
            author={comment.author}
            createdAt={comment.createdAt}
            community={comment.community}
            comments={comment.children}
            isComment={true}
          />
        ))}
      </div>
    </section>
  );
};
export default Page;
