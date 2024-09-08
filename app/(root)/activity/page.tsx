import { fetchUser, getActivityLogs } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';

const Page = async () => {
  const user = await currentUser();
  if (!user) {
    return null;
  }
  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) {
    redirect('/onboarding');
  }

  const activities = await getActivityLogs(userInfo._id);

  return (
    <section>
      <h1>Activity</h1>
      <section className="mt-10 flex flex-col gap-5">
        {activities.length > 0 ? (
          <>
            {activities.map((log) => (
              <Link key={log._id} href={`/thread/${log.parentId}`}>
                <article className="activity-card">
                  <Image
                    src={log.author.image}
                    alt="Profile Picture"
                    width={20}
                    height={20}
                    className="rounded-full object-contain"
                  />
                  <p className="!text-small-regular text-light-1">
                    <span className="mr-1 text-primary-500">
                      {log.author.name}
                    </span>{' '}
                    replied to your thread
                  </p>
                </article>
              </Link>
            ))}
          </>
        ) : (
          <>
            <p className="!text-base-regular text-gray-1">
              No activity to show.
            </p>
          </>
        )}
      </section>
    </section>
  );
};
export default Page;
