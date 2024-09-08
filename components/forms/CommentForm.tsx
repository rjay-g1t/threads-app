'use client';
import { useState } from 'react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Image from 'next/image';
import { Textarea } from '../ui/textarea';
import { usePathname, useRouter } from 'next/navigation';
import { CommentValidation } from '@/lib/validations/threads';
import { updateUser } from '@/lib/actions/user.actions';
import { AddCommentToThread, createThread } from '@/lib/actions/thread.action';

interface CommentProps {
  threadId: string;
  currentUserImage: string;
  currentUserId: string;
}

const Comment: React.FC<CommentProps> = ({
  threadId,
  currentUserImage,
  currentUserId,
}) => {
  const pathname = usePathname();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      comment: '',
    },
  });

  const onSubmitValues: SubmitHandler<
    z.infer<typeof CommentValidation>
  > = async (values) => {
    const { comment } = values;
    console.log('currentUserId', currentUserId);
    await AddCommentToThread({
      commentText: comment,
      userId: currentUserId,
      path: pathname,
      threadId,
    });

    form.reset();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmitValues)}
        className="comment-form"
      >
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem className="flex items-center gap-3 w-full">
              <FormLabel>
                <Image
                  src={currentUserImage}
                  alt="user-image"
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
              </FormLabel>
              <FormControl className="border-none bg-transparent">
                <Input
                  type="text"
                  placeholder="Comment ..."
                  className="no-focus text-light-1 outline-none"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" className="comment-form_btn">
          Reply
        </Button>
      </form>
    </Form>
  );
};

export default Comment;
