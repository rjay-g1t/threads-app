'use server';

import { revalidatePath } from 'next/cache';
import User from '../models/user.model';
import { connectToDatabase } from '../mongoose';

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
