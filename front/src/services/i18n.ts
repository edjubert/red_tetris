import { dictionary, locale, _, getLocaleFromNavigator } from 'svelte-i18n';
import { derived } from 'svelte/store';

const MESSAGE_FILE_URL_TEMPLATE = '/lang/{locale}.json';

let cachedLocale;

const setupI18n = async () => {
	const _locale = getLocaleFromNavigator() || 'en';
	const messagesFileUrl = MESSAGE_FILE_URL_TEMPLATE.replace('{locale}', _locale);

	const response = await fetch(messagesFileUrl);
	const messages = await response.json();
	console.log({ messages, _locale });
	dictionary.set({ [_locale]: messages });
	cachedLocale = _locale;
	locale.set(_locale);
};

const isLocaleLoaded = derived(locale, ($locale) => typeof $locale === 'string');

export { _, setupI18n, isLocaleLoaded };
