
'use server';

import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { getDb } from '@/lib/db';
import { cookies } from 'next/headers';
import type { User } from '@/types';

const SignupSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
  name: z.string().min(2, { message: 'Name is required.' }),
});

const LoginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

const SESSION_COOKIE_NAME = 'dinedash_session';

export async function signupUser(prevState: any, formData: FormData) {
  const validatedFields = SignupSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      type: 'error',
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid form data.',
    };
  }

  const { email, password, name } = validatedFields.data;

  try {
    const db = await getDb();
    const existingUser = await db.get('SELECT * FROM users WHERE email = ?', email);
    if (existingUser) {
      return { type: 'error', message: 'User with this email already exists.' };
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const role = 'manager'; // Default role

    const result = await db.run(
      'INSERT INTO users (email, password_hash, name, role) VALUES (?, ?, ?, ?)',
      email,
      passwordHash,
      name,
      role
    );

    if (result.lastID) {
      const user: User = { id: result.lastID.toString(), email, name, role };
      
      // Set session cookie
      cookies().set(SESSION_COOKIE_NAME, JSON.stringify(user), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/',
        sameSite: 'lax',
      });

      return { type: 'success', message: 'Signup successful! Redirecting...', user };
    } else {
      return { type: 'error', message: 'Signup failed. Please try again.' };
    }
  } catch (error) {
    console.error('Signup error:', error);
    return { type: 'error', message: 'An unexpected error occurred during signup.' };
  }
}

export async function loginUser(prevState: any, formData: FormData) {
  const validatedFields = LoginSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      type: 'error',
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid form data.',
    };
  }

  const { email, password } = validatedFields.data;

  try {
    const db = await getDb();
    const userRecord = await db.get('SELECT * FROM users WHERE email = ?', email);

    if (!userRecord) {
      return { type: 'error', message: 'Invalid email or password.' };
    }

    const passwordMatch = await bcrypt.compare(password, userRecord.password_hash);
    if (!passwordMatch) {
      return { type: 'error', message: 'Invalid email or password.' };
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

    return { type: 'success', message: 'Login successful! Redirecting...', user };
  } catch (error) {
    console.error('Login error:', error);
    return { type: 'error', message: 'An unexpected error occurred during login.' };
  }
}

export async function logoutUser() {
  try {
    cookies().delete(SESSION_COOKIE_NAME);
    return { type: 'success', message: 'Logout successful.' };
  } catch (error) {
    console.error('Logout error:', error);
    return { type: 'error', message: 'Logout failed.' };
  }
}

export async function getCurrentUser(): Promise<User | null> {
  const sessionCookie = cookies().get(SESSION_COOKIE_NAME);
  if (sessionCookie?.value) {
    try {
      const user = JSON.parse(sessionCookie.value) as User;
      // Optionally, re-validate user against DB here if needed for more security
      return user;
    } catch (error) {
      console.error("Error parsing session cookie:", error);
      return null;
    }
  }
  return null;
}
