import { getItem, setItem } from '@/storage/safeLocalStorage'

/**
 * Clé partagée entre la clé localStorage (lue par Vite côté client) et le nom
 * du cookie (lu par Next.js côté serveur via `next/headers`).
 */
export const DARK_MODE_STORAGE_KEY = 'darkMode'

type DarkModeStorageValue = 'true' | 'false'

const COOKIE_MAX_AGE_SECONDS = 365 * 24 * 60 * 60

const serializeDarkMode = (value: boolean): DarkModeStorageValue =>
	value ? 'true' : 'false'

export const parseDarkModeValue = (raw: string | undefined | null): boolean =>
	raw === 'true'

/**
 * Lecture côté client utilisée par Vite (Next.js lit le cookie côté serveur et
 * passe la valeur initiale via `initialDarkMode`).
 */
export const readDarkModeFromLocalStorage = (): boolean =>
	parseDarkModeValue(getItem(DARK_MODE_STORAGE_KEY))

/**
 * Persiste la préférence à la fois dans le localStorage (utilisé par Vite à la
 * lecture initiale) et dans un cookie (utilisé par Next.js en SSR).
 */
export const persistDarkMode = (darkMode: boolean) => {
	const value = serializeDarkMode(darkMode)
	setItem(DARK_MODE_STORAGE_KEY, value)
	if (typeof document !== 'undefined') {
		const secure = window.location.protocol === 'https:' ? '; Secure' : ''
		document.cookie = `${DARK_MODE_STORAGE_KEY}=${value}; max-age=${COOKIE_MAX_AGE_SECONDS}; path=/; SameSite=Lax${secure}`
	}
}
