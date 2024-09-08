import { Fragment } from 'react';
import { redirect } from 'next/navigation';
import PostThread from '@/components/forms/PostThread';
import { fetchUser } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs';

async function Page() {
  const user = await currentUser();
  if (!user) {
    return null;
  }

  const userInfo = await fetchUser(user.id);

  if (!userInfo?.onboarded) {
    return redirect('/onboarding');
  }

  return (
    <Fragment>
      <h1 className="head-text">Create Thread</h1>
      <PostThread userId={userInfo._id.toString()} />
    </Fragment>
  );
}
export default Page;
