
'use server';

import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { getDb } from '@/lib/db';
import { cookies } from 'next/headers';
import type { User } from '@/types';

const LoginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

const SESSION_COOKIE_NAME = 'dinedash_session';

export async function loginUser(prevState: any, formData: FormData) {
  const validatedFields = LoginSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      type: 'error' as const,
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid form data.',
    };
  }

  const { email, password } = validatedFields.data;

  try {
    const db = await getDb();
    const userRecord = await db.get('SELECT * FROM users WHERE email = ?', email);

    if (!userRecord) {
      return { type: 'error' as const, message: 'Invalid email or password.' };
    }

    const passwordMatch = await bcrypt.compare(password, userRecord.password_hash);
    if (!passwordMatch) {
      return { type: 'error' as const, message: 'Invalid email or password.' };
    }
    
    const user: User = { id: userRecord.id.toString(), email: userRecord.email, name: userRecord.name, role: userRecord.role as User['role'] };

    // Set session cookie
    cookies().set(SESSION_COOKIE_NAME, JSON.stringify(user), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
      sameSite: 'lax',
    });

    return { type: 'success' as const, message: 'Login successful! Redirecting...', user };
  } catch (error) {
    console.error('Login error:', error);
    return { type: 'error' as const, message: 'An unexpected error occurred during login.' };
  }
}

export async function logoutUser() {
  try {
    cookies().delete(SESSION_COOKIE_NAME);
    return { type: 'success' as const, message: 'Logout successful.' };
  } catch (error) {
    console.error('Logout error:', error);
    return { type: 'error' as const, message: 'Logout failed.' };
  }
}

export async function getCurrentUser(): Promise<User | null> {
  const sessionCookie = cookies().get(SESSION_COOKIE_NAME);
  if (sessionCookie?.value) {
    try {
      const userFromCookie = JSON.parse(sessionCookie.value) as User;
      
      // Validate user against DB
      const db = await getDb();
      // Ensure user.id is treated as a number for the query if the DB column is INTEGER
      const userIdAsNumber = Number(userFromCookie.id);
      if (isNaN(userIdAsNumber)) {
        console.error("Invalid user ID in cookie:", userFromCookie.id);
        cookies().delete(SESSION_COOKIE_NAME);
        return null;
      }

      const userRecord = await db.get('SELECT * FROM users WHERE id = ?', userIdAsNumber);
      
      if (!userRecord) {
        console.warn("Session user not found in DB (ID:", userIdAsNumber,"), clearing cookie.");
        cookies().delete(SESSION_COOKIE_NAME);
        return null;
      }

      // Ensure the role in the cookie matches the DB role and other critical fields if necessary
      // For now, we trust the cookie if the user ID is valid and found.
      // Reconstruct user from DB record to ensure data consistency, especially role.
      const validatedUser: User = {
        id: userRecord.id.toString(),
        email: userRecord.email,
        name: userRecord.name,
        role: userRecord.role as User['role']
      };

      // If cookie data differs from DB (e.g. role), update cookie
      if (userRecord.role !== userFromCookie.role || userRecord.name !== userFromCookie.name || userRecord.email !== userFromCookie.email) {
         console.warn("Session user data mismatch with DB, updating cookie.");
         cookies().set(SESSION_COOKIE_NAME, JSON.stringify(validatedUser), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7, 
            path: '/',
            sameSite: 'lax',
        });
      }
      return validatedUser;
    } catch (error) {
      console.error("Error parsing or validating session cookie:", error);
      cookies().delete(SESSION_COOKIE_NAME);
      return null;
    }
  }
  return null;
}
