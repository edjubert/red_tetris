export const verifyInput = (value: string) => {
	if (!value.trim()) {
		return 'field required';
	}

	if (!/^[a-z0-9_-]*$/i.test(value.trim())) {
		return 'bad format';
	}
};
