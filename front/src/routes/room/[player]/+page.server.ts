import type { Actions } from './$types';

export const actions = {
	start: async (event) => {
		console.log('default action', event);
	}
} satisfies Actions;
