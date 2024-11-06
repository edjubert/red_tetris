import { dictionary, locale, _, getLocaleFromNavigator } from 'svelte-i18n';
import { derived } from 'svelte/store';

const MESSAGE_FILE_URL_TEMPLATE = '/lang/{locale}.json';

const getLocale = (): string => {
	const _locale = getLocaleFromNavigator();
	switch (_locale) {
		case 'fr':
		case 'en':
			return _locale;
		default:
			return 'en';
	}
};

const setupI18n = async () => {
	const _locale = getLocale();
	const messagesFileUrl = MESSAGE_FILE_URL_TEMPLATE.replace('{locale}', _locale);

	const response = await fetch(messagesFileUrl);
	const messages = await response.json();
	console.log({ messages, _locale });
	dictionary.set({ [_locale]: messages });
	locale.set(_locale);
};

const isLocaleLoaded = derived(locale, ($locale) => typeof $locale === 'string');

export { _, setupI18n, isLocaleLoaded };
