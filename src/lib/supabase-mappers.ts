function coerceBool(v: unknown): boolean {
	return v === true || v === 'true';
}

export type RoomRow = {
	id: string;
	name: string;
	description: string | null;
	vote_clear: string | null;
	restrict_control: boolean | null;
	show_votes: boolean | null;
	owner: string | null;
	banned: string[] | null;
	created: string | null;
	updated: string | null;
};

export type UserPublicRow = {
	id: string;
	name: string | null;
	avatar: string | null;
	vote: string | null;
	vote_time: string | null;
	room: string | null;
	created: string | null;
	updated: string | null;
};

export function mapRoom(row: RoomRow) {
	const restrict = coerceBool(row.restrict_control);
	const show = coerceBool(row.show_votes);
	return {
		...row,
		voteClear: row.vote_clear,
		restrictControl: restrict,
		showVotes: show,
		banned: row.banned ?? []
	};
}

export function mapUserPublic(row: UserPublicRow) {
	return {
		...row,
		voteTime: row.vote_time
	};
}

export type MappedRoom = ReturnType<typeof mapRoom>;
export type MappedUserPublic = ReturnType<typeof mapUserPublic>;
