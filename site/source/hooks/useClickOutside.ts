import { RefObject, useEffect } from 'react'

type Event = MouseEvent | TouchEvent

export const useOnClickOutside = (
	ref: RefObject<HTMLElement>,
	handler: (event: Event | null) => void
) => {
	useEffect(() => {
		const listener = (event: Event | null) => {
			// Do nothing if clicking ref's element or descendent elements
			if (
				!ref.current ||
				(event?.target instanceof HTMLElement &&
					ref.current.contains(event.target))
			) {
				return
			}
			handler(event)
		}
		document.addEventListener('mousedown', listener)
		document.addEventListener('touchstart', listener)

		return () => {
			document.removeEventListener('mousedown', listener)
			document.removeEventListener('touchstart', listener)
		}
	}, [ref, handler])
}
