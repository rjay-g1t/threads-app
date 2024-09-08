import ThreadCard from '@/components/cards/TreadCard';
import { fetchUser } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

const Page = async ({ params }: { params: { id: string } }) => {
  if (!params.id) return null;
  const user = await currentUser();
  const userInfo = await fetchUser(user?.id || '');
  if (!userInfo) return redirect('/onboarding');
  return (
    <section className="relative">
      <div>
        <ThreadCard
          key={params.id}
          id={params.id}
          currentUserId={user?.id || ''}
          parentId={null}
          content="content"
          author={userInfo}
          community={null}
          createdAt="createdAt"
          comments={[]}
        />
      </div>
    </section>
  );
};
export default Page;
