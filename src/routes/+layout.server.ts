import { env } from "$env/dynamic/private";

export const load = async () => {
	return {
		umamiID: env.SECRET_UMAMI_ID
	};
};
