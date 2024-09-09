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
import { ThreadValidation } from '@/lib/validations/threads';
import { updateUser } from '@/lib/actions/user.actions';
import { createThread } from '@/lib/actions/thread.action';
import { useOrganization } from '@clerk/nextjs';

function PostThread({ userId }: { userId: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const { organization } = useOrganization();

  const form = useForm({
    resolver: zodResolver(ThreadValidation),
    defaultValues: {
      thread: '',
      accountId: userId,
    },
  });

  const onSubmitValues: SubmitHandler<
    z.infer<typeof ThreadValidation>
  > = async (values) => {
    console.log('values', values);
    console.log('organization', organization);
    try {
      await createThread({
        text: values.thread,
        author: values.accountId,
        communityId: organization?.id || '',
        path: pathname,
      });
      router.push('/');
    } catch (error) {
      console.log(`Failed to create thread: ${error}`);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmitValues)}
        className="mt-10 flex flex-col justify-start gap-10"
      >
        <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-3 w-full">
              <FormLabel className="text-base-semibold text-light-2">
                Content
              </FormLabel>
              <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1">
                <Textarea
                  // {...field}
                  rows={15}
                  {...field}
                  // onChange={(e) => handleImage(e, field.onChange)}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" className="bg-primary-500">
          Post Thread
        </Button>
      </form>
    </Form>
  );
}

export default PostThread;
