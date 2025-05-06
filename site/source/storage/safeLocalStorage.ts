export function removeItem(key: string) {
	try {
		return window.localStorage.removeItem(key)
	} catch (error) {
		if (error instanceof Error && error.name === 'SecurityError') {
			// eslint-disable-next-line no-console
			console.warn(
				'[localStorage] Unable to remove item due to security settings'
			)
		}

		return null
	}
}

export function getItem(key: string) {
	try {
		return window.localStorage.getItem(key)
	} catch (error) {
		if (error instanceof Error && error.name === 'SecurityError') {
			// eslint-disable-next-line no-console
			console.warn('[localStorage] Unable to get item due to security settings')
		}

		return null
	}
}

export function setItem(key: string, value: string) {
	try {
		return window.localStorage.setItem(key, value)
	} catch (error) {
		if (error instanceof Error && error.name === 'SecurityError') {
			// eslint-disable-next-line no-console
			console.warn('[localStorage] Unable to set item due to security settings')
		}

		return null
	}
}
