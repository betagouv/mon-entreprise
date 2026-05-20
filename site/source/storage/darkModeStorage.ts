import { getItem, setItem } from '@/storage/safeLocalStorage'

export const DARK_MODE_STORAGE_KEY = 'darkMode'

type DarkModeStorageValue = 'true' | 'false'

const COOKIE_MAX_AGE_SECONDS = 365 * 24 * 60 * 60

const serializeDarkMode = (value: boolean): DarkModeStorageValue =>
	value ? 'true' : 'false'

export const parseDarkModeValue = (raw: string | undefined | null): boolean =>
	raw === 'true'

export const readDarkModeForVite = (): boolean =>
	parseDarkModeValue(getItem(DARK_MODE_STORAGE_KEY))

const persistDarkModeForVite = (value: DarkModeStorageValue) =>
	setItem(DARK_MODE_STORAGE_KEY, value)

const persistDarkModeForNext = (value: DarkModeStorageValue) => {
	if (typeof document === 'undefined') return
	const secure = window.location.protocol === 'https:' ? '; Secure' : ''
	document.cookie = `${DARK_MODE_STORAGE_KEY}=${value}; max-age=${COOKIE_MAX_AGE_SECONDS}; path=/; SameSite=Lax${secure}`
}

export const persistDarkMode = (darkMode: boolean) => {
	const value = serializeDarkMode(darkMode)
	persistDarkModeForVite(value)
	persistDarkModeForNext(value)
}
