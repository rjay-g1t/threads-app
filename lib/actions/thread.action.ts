'use server';

import { revalidatePath } from 'next/cache';
import Thread from '../models/thread.model';
import User from '../models/user.model';
import { connectToDatabase } from '../mongoose';
import path from 'path';
import { model } from 'mongoose';

interface Params {
  text: string;
  author: string;
  communityId: string | null;
  path: string;
}
export async function createThread({
  text,
  author,
  communityId,
  path,
}: Params) {
  try {
    connectToDatabase();
    const createdThread = await Thread.create({
      text,
      author,
      community: null,
    });

    await User.findByIdAndUpdate(author, {
      $push: { threads: createdThread._id },
    });

    revalidatePath(path);
  } catch (error) {
    throw new Error(`Failed to create thread: ${error}`);
  }
}

export async function fetchPosts(pageNumber = 1, pageSize = 20) {
  connectToDatabase();
  const skipAmount = (pageNumber - 1) * pageSize;

  // no parents post
  const postsQuery = Thread.find({ parentId: { $in: [null, undefined] } })
    .sort({ createdAt: 'desc' })
    .skip(skipAmount)
    .limit(pageSize)
    .populate({ path: 'author', model: User })
    .populate({
      path: 'children',
      populate: {
        path: 'author',
        model: User,
        select: '_id name parentId image',
      },
    });
  const totalPostsCount = await Thread.countDocuments({
    parentId: { $in: [null, undefined] },
  });
  const posts = await postsQuery.exec();
  const isNext = totalPostsCount > skipAmount + posts.length;
  return { posts, isNext };
}

export async function fethThreadById(userId: string) {
  connectToDatabase();
  try {
    // TODO: Populate Community
    const thread = await Thread.findById(userId)
      .populate({
        path: 'author',
        model: User,
        select: '_id name parentId image',
      })
      .populate({
        path: 'children',
        populate: [
          {
            path: 'author',
            model: User,
            select: '_id name parentId image',
          },
          {
            path: 'children',
            model: Thread,
            populate: {
              model: User,
              path: 'author',
              select: '_id name parentId image',
            },
          },
        ],
      })
      .exec();
    return thread;
  } catch (error: any) {
    throw new Error(`Failed to fetch user's threads: ${error}`);
  }
}

export async function AddCommentToThread({
  threadId,
  commentText,
  userId,
  path,
}: {
  threadId: string;
  commentText: string;
  userId: string;
  path: string;
}) {
  connectToDatabase();
  try {
    const originalThread = await Thread.findById(threadId);
    if (!originalThread) {
      throw new Error('Thread not found');
    }
    const commentThread = new Thread({
      text: commentText,
      author: userId,
      parentId: threadId,
    });
    const savedComment = await commentThread.save();
    originalThread.children.push(savedComment._id);
    await originalThread.save();
    revalidatePath(path);
  } catch (error) {
    throw new Error(`Failed to add comment to thread: ${error}`);
  }
}
