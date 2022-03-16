import { RefObject, useEffect } from 'react'

/**
 * Workaround for preventing clicks propagating
 * to elements behind the button clicked
 * Inspired from this issue https://github.com/adobe/react-spectrum/issues/1513
 * @param buttonRef Ref of the button
 */
export const usePreventClickAfterTouch = (
	buttonRef: RefObject<HTMLButtonElement>
) => {
	useEffect(() => {
		const button = buttonRef.current
		const preventDefault = (e: HTMLElementEventMap['touchstart']) =>
			e.preventDefault()

		button?.addEventListener('touchstart', preventDefault)
	}, [buttonRef])
}
