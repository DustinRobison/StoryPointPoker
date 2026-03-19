/* eslint-disable @typescript-eslint/no-explicit-any */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const validateData = async (formData: any, schema: any) => {
	const body = Object.fromEntries(formData);

	try {
		const data = schema.parse(body);
		return {
			formData: data,
			errors: null
		};
	} catch (err: any) {
		// Avoid logging the entire error object (Zod errors can be hard to serialize
		// and may crash console inspection in some environments).
		const errors = typeof err?.flatten === 'function' ? err.flatten() : { formErrors: [], fieldErrors: {} };
		return {
			formData: body,
			errors
		};
	}
};


export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
 }