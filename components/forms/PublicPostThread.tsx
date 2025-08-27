'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import AuthModal from '@/components/shared/AuthModal';

const PublicPostThread = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handlePostClick = () => {
    setShowAuthModal(true);
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        <Textarea
          rows={3}
          placeholder="What's on your mind? (Sign up to post)"
          className="no-focus border-none bg-dark-3 text-light-1 cursor-pointer"
          onClick={handlePostClick}
          readOnly
        />
        <Button 
          onClick={handlePostClick}
          className="bg-primary-500"
        >
          Post
        </Button>
      </div>
      
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        action="post a thread"
      />
    </>
  );
};

export default PublicPostThread;
