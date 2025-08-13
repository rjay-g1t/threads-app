'use client';

import Image from 'next/image';
import { likeThread } from '@/lib/actions/thread.action';
import { useState } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import Link from 'next/link';

interface LikedUser {
  id: string;
  name: string;
  image: string;
}

interface LikeButtonProps {
  threadId: string;
  userId: string;
  likes: string[];
  likedBy: LikedUser[];
}

const LikeButton = ({
  threadId,
  userId,
  likes = [],
  likedBy = [],
}: LikeButtonProps) => {
  const [isLiked, setIsLiked] = useState(likes.includes(userId));
  const [likeCount, setLikeCount] = useState(likes.length);
  const [currentLikedBy, setCurrentLikedBy] = useState(likedBy);

  const handleLikeClick = async () => {
    try {
      // Optimistically update UI
      setIsLiked(!isLiked);
      setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);

      await likeThread({
        threadId,
        userId,
        path: '/',
        isLiked,
      });
    } catch (error) {
      // Revert on error
      setIsLiked(isLiked);
      setLikeCount(likeCount);
      console.error('Error toggling like:', error);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button onClick={handleLikeClick}>
        <Image
          src={isLiked ? '/assets/heart-filled.svg' : '/assets/heart-gray.svg'}
          alt="heart"
          width={24}
          height={24}
          className="cursor-pointer object-contain"
        />
      </button>

      {likeCount > 0 && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="text-subtle-medium text-gray-1 cursor-pointer">
                {likeCount}
              </span>
            </TooltipTrigger>
            <TooltipContent
              className="bg-dark-3 border-none text-light-1 p-3"
              side="top"
              align="center"
            >
              <div className="flex flex-col gap-2">
                <p className="text-small-medium">Liked by:</p>
                <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto">
                  {currentLikedBy.length > 0 ? (
                    currentLikedBy.map((user) => (
                      <Link
                        key={user.id}
                        href={`/profile/${user.id}`}
                        className="flex items-center gap-2 hover:bg-dark-4 p-2 rounded-lg"
                      >
                        <Image
                          src={user.image}
                          alt={user.name}
                          width={24}
                          height={24}
                          className="rounded-full"
                        />
                        <span className="text-small-medium text-light-1">
                          {user.name}
                        </span>
                      </Link>
                    ))
                  ) : (
                    <p className="text-gray-1">No likes yet</p>
                  )}
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};

export default LikeButton;
