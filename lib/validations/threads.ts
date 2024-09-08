import { z } from 'zod';

export const ThreadValidation = z.object({
  thread: z
    .string()
    .nonempty()
    .min(3, { message: 'Thread must be at least 3 characters long' }),
  accountId: z.string().nonempty(),
});

export const CommentValidation = z.object({
  comment: z
    .string()
    .nonempty()
    .min(3, { message: 'Comment must be at least 3 characters long' }),
});
