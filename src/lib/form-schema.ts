import { z } from 'zod';

// Regular expression for URL-safe unreserved characters (A-Z, a-z, 0-9, -, ., _, ~)
export const urlSafeRegex = /^[A-Za-z0-9\-._~]*$/;

export const roomNameSchema = z.object({
  roomName: z
    .string()
    .min(4, { message: 'Room name must be at least 4 characters long' })
    .max(20, { message: 'Room name must be at most 20 characters long' })
    .regex(urlSafeRegex, {
      message: 'Room name can only contain letters, numbers, and -._~',
    }),
});