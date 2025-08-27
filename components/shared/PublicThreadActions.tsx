'use client';

import { useState } from 'react';
import Image from 'next/image';
import AuthModal from './AuthModal';

interface PublicThreadActionsProps {
  threadId: string;
}

const PublicThreadActions = ({ threadId }: PublicThreadActionsProps) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [modalAction, setModalAction] = useState('');

  const handleActionClick = (action: string) => {
    setModalAction(action);
    setShowAuthModal(true);
  };

  return (
    <>
      <button onClick={() => handleActionClick('like this thread')}>
        <Image
          src="/assets/heart-gray.svg"
          alt="heart"
          width={24}
          height={24}
          className="cursor-pointer object-contain"
        />
      </button>
      <button onClick={() => handleActionClick('reply to this thread')}>
        <Image
          src="/assets/reply.svg"
          alt="reply"
          width={20}
          height={20}
          className="cursor-pointer object-contain"
        />
      </button>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        action={modalAction}
      />
    </>
  );
};

export default PublicThreadActions;
