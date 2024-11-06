import type { PageData } from './$types';

export const load: PageData = ({ params }) => {
	return {
		room: params.room,
		player: params.player
	};
};
