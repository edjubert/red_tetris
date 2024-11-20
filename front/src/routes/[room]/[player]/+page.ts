export const load = ({
	params
}: {
	params: { restart: () => void; room: string; player: string };
}) => {
	return {
		handleRestart: params.restart,
		room: params.room,
		player: params.player
	};
};
