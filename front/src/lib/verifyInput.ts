export const verifyInput = (value: string): { valid: boolean; err?: string } => {
	if (!value?.trim()) {
		return { valid: false, err: 'field required' };
	}

	if (!/^[a-z0-9_-]{1,16}$/i.test(value.trim())) {
		return { valid: false, err: 'bad format' };
	}

	return { valid: true };
};
