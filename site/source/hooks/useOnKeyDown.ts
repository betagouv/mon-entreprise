import { useEffect } from 'react'

export const useOnKeyDown = (
	keyPress: string | null,
	handler: (event: KeyboardEvent) => void
) => {
	useEffect(() => {
		const listener = (event: KeyboardEvent) => {
			if (!keyPress || event.key === keyPress) {
				handler(event)
			}
		}
		window.addEventListener('keydown', listener)

		return () => {
			window.removeEventListener('keydown', listener)
		}
	}, [handler, keyPress])
}
