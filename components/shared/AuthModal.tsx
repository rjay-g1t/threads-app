'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  action: string; // "like", "post", "comment", etc.
}

const AuthModal = ({ isOpen, onClose, action }: AuthModalProps) => {
  const router = useRouter();

  if (!isOpen) return null;

  const handleSignUp = () => {
    router.push('/sign-up');
  };

  const handleSignIn = () => {
    router.push('/sign-in');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-dark-2 rounded-xl p-8 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-heading3-bold text-light-1">
            Authentication Required
          </h2>
          <button onClick={onClose} className="text-light-2 hover:text-light-1">
            ✕
          </button>
        </div>

        <div className="mb-6">
          <p className="text-base-regular text-light-2 mb-4">
            To {action}, you need to create an account or sign in.
          </p>
          <p className="text-small-regular text-gray-1">
            🔒 We use ClerkJS for authentication - everything is safe and
            secured!
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            onClick={handleSignUp}
            className="bg-primary-500 hover:bg-primary-500/90 text-light-1 w-full"
          >
            Create Account
          </Button>
          <Button
            onClick={handleSignIn}
            className="bg-transparent border border-dark-4 text-light-1 hover:bg-dark-3 w-full"
          >
            Sign In
          </Button>
          <Button
            onClick={onClose}
            className="bg-transparent text-gray-1 hover:text-light-2 hover:bg-dark-4 w-full"
          >
            Continue Browsing
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
