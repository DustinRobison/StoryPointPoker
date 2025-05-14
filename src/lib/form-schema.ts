import { Filter } from 'bad-words';
import { z } from 'zod';

// Regular expression for URL-safe unreserved characters (A-Z, a-z, 0-9, -, ., _, ~)
export const urlSafeRegex = /^[A-Za-z0-9\-._~]*$/;
const filter = new Filter();

// ------------------------------
// ROOM NAME
// ------------------------------
export const roomNameSchema = z.object({
  roomName: z
    .string()
    .min(4, { message: 'Room name must be at least 4 characters long' })
    .max(20, { message: 'Room name must be at most 20 characters long' })
    .regex(urlSafeRegex, {
      message: 'Room name can only contain letters, numbers, and -._~',
    })
    .refine((value) => !filter.isProfane(value), {
      message: 'Cannot contain profanity',
    }),
});

// ------------------------------
// USER NAME
// ------------------------------
export const userNameSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters long' })
    .max(12, { message: 'Name must be at most 12 characters long' })
    .regex(urlSafeRegex, {
      message: 'Name can only contain letters, numbers, and -._~',
    })
    .refine((value) => !filter.isProfane(value), {
      message: 'Cannot contain profanity',
    }),
});

// ------------------------------
// CREATE GUEST BOOK POST
// ------------------------------
export const createGuestBookPostSchema = z.object({
  honeypot: z.string().max(0),
	content: z
		.string({ required_error: 'Message is required' })
		.min(1, { message: 'Message must be at least 1 character' })
		.max(250, { message: 'Message must be 250 characters or less' })
		.refine((value) => !filter.isProfane(value), {
			message: 'Message contains inappropriate language'
		})
});

// ------------------------------
// LIKE GUEST BOOK POST
// ------------------------------
export const likeGuestBookPostSchema = z.object({
	postId: z.string(),
	currentUserId: z.string()
});