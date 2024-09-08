'use server';

import { revalidatePath } from 'next/cache';
import User from '../models/user.model';
import { connectToDatabase } from '../mongoose';
import Thread from '../models/thread.model';
import { FilterQuery, SortOrder } from 'mongoose';

type UpdateUserParams = {
  userId: string;
  username: string;
  name: string;
  image: string;
  bio: string;
  path: string;
  onboarded: boolean;
};

export async function updateUser({
  userId,
  username,
  name,
  image,
  bio,
  path,
  onboarded,
}: UpdateUserParams): Promise<void> {
  connectToDatabase();

  try {
    await User.findOneAndUpdate(
      { id: userId },
      {
        username: username.toLowerCase(),
        name,
        image,
        bio,
        path,
        onboarded,
      },
      { upsert: true }
    );

    if (path === '/profile/edit') {
      revalidatePath(path);
    }
  } catch (error) {
    console.log(`Failed to update/create user: ${error}`);
  }
}

export async function fetchUser(userId: string) {
  connectToDatabase();
  try {
    const user = await User.findOne({ id: userId });
    // .populate({
    //ath: 'communities',
    //model: 'id name image',
    //});
    return user;
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error}`);
  }
}

export async function fetchUserPosts(userId: string) {
  connectToDatabase();
  try {
    // TODO: populate community
    const threads = await User.findOne({ id: userId }).populate({
      path: 'threads',
      model: Thread,
      populate: {
        path: 'children',
        model: Thread,
        populate: {
          path: 'author',
          model: User,
          select: 'name image id',
        },
      },
    });
    return threads;
  } catch (error: any) {
    throw new Error(`Failed to fetch user posts: ${error}`);
  }
}

export async function fetchUsers({
  userId,
  searchString = '',
  pageNumber = 1,
  pageSize = 20,
  sortBy = 'desc',
}: {
  userId: string;
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
}) {
  try {
    connectToDatabase();
    const skipAmount = (pageNumber - 1) * pageSize;
    const regex = new RegExp(searchString, 'i');
    const query: FilterQuery<typeof User> = {
      id: { $ne: userId },
    };
    if (searchString.trim() !== '') {
      query.$or = [
        {
          username: { $regex: regex },
        },
        {
          name: { $regex: regex },
        },
      ];
    }
    const sortOptions = { createdAt: sortBy };
    const usersQuery = User.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    const totalUsersCount = await User.countDocuments(query);

    const users = await usersQuery.exec();

    const isNext = totalUsersCount > skipAmount + users.length;
    return { users, isNext };
  } catch (error: any) {
    throw new Error(`Failed to fetch users: ${error}`);
  }
}

export async function getActivityLogs(userId: string) {
  try {
    connectToDatabase();

    const userThreads = await Thread.find({ author: userId });

    const childThreadIds = userThreads.reduce((acc, thread) => {
      return acc.concat(thread.children);
    }, []);

    const replies = await Thread.find({
      _id: { $in: childThreadIds },
      author: { $ne: userId },
    }).populate({
      path: 'author',
      model: User,
      select: 'name image id',
    });

    return replies;
  } catch (error: any) {
    throw new Error(`Failed to fetch user activity logs: ${error}`);
  }
}
