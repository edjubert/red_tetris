export const load = ({ params }: { params: { room: string; player: string } }) => {
	return {
		room: params.room,
		player: params.player
	};
};
