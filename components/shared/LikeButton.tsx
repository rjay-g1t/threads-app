'use client';

import Image from 'next/image';
import { likeThread, unlikeThread } from '@/lib/actions/thread.action';

interface LikeButtonProps {
  threadId: string;
  userId: string;
  likes: string[];
}

const LikeButton = ({ threadId, userId, likes }: LikeButtonProps) => {
  const isLiked = likes && likes?.includes(userId);

  const handleLikeClick = async () => {
    try {
      if (isLiked) {
        await unlikeThread(threadId, userId, '/');
      } else {
        await likeThread(threadId, userId, '/');
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };
  console.log(isLiked);
  return (
    <button onClick={handleLikeClick} className="flex items-center gap-2">
      <Image
        src={isLiked ? '/assets/heart-filled.svg' : '/assets/heart-gray.svg'}
        alt="heart"
        width={20}
        height={20}
        className="cursor-pointer object-contain"
      />
      {likes && likes?.length > 0 && (
        <span className="text-subtle-medium text-gray-1">{likes.length}</span>
      )}
    </button>
  );
};

export default LikeButton;
