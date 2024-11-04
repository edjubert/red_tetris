import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	return {
		player: params.player
	};
};
