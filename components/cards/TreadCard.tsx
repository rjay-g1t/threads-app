import Image from 'next/image';
import Link from 'next/link';

interface ThreadCardProps {
  key: string;
  id: string;
  currentUserId: string;
  parentId: string | null;
  content: string;
  author: {
    id: string;
    name: string;
    image: string;
  };
  community: {
    id: string;
    name: string;
    image: string;
  } | null;
  createdAt: string;
  comments: {
    author: {
      image: string;
    };
  }[];
  isComment?: boolean;
}

const ThreadCard = ({
  key,
  id,
  currentUserId,
  parentId,
  content,
  author,
  community,
  createdAt,
  comments,
  isComment,
}: ThreadCardProps) => {
  return (
    <article className="flex w-full flex-col rounded-xl bg-dark-2 p-7">
      <div className="flex items-start justify-between">
        <div className="flex w-full flex-1 flex-row gap-4">
          <div className="flex flex-col items center">
            <Link href={`/user/${author.id}`} className="relative h-11 w-11">
              <Image
                src={author.image}
                alt="author"
                fill
                className="cursor-pointer rounded-full"
              />
            </Link>
            <div className="thread-card_bar" />
          </div>
          <div className="flex w-full flex-col">
            <Link href={`/user/${author.id}`} className="w-fit">
              <h4 className="cursor-pointer text-base-semibold text-light-1">
                {author.name}
              </h4>
            </Link>
            <p className="mt-2 text-small-regular text-light-2">{content}</p>
            <div className="mt-5 flex flex-row gap-3">
              <Image
                src="/assets/heart-gray.svg"
                alt="heart"
                width={20}
                height={20}
              />
              <Link href={`/thread/${id}`}>
                <Image
                  src="/assets/reply.svg"
                  alt="heart"
                  width={20}
                  height={20}
                />
              </Link>
              <Image
                src="/assets/repost.svg"
                alt="heart"
                width={20}
                height={20}
              />
              <Image
                src="/assets/share.svg"
                alt="heart"
                width={20}
                height={20}
              />
            </div>
            {isComment && comments.length > 0 && (
              <Link href={`/thread/${id}`}>
                <p className="mt-1 text-suble-medium"></p>
              </Link>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};
export default ThreadCard;
