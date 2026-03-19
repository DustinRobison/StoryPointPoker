type RoomRow = {
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

type UserPublicRow = {
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
	return {
		...row,
		voteClear: row.vote_clear,
		restrictControl: row.restrict_control,
		showVotes: row.show_votes,
		banned: row.banned ?? []
	};
}

export function mapUserPublic(row: UserPublicRow) {
	return {
		...row,
		voteTime: row.vote_time
	};
}
