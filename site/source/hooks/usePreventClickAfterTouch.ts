import { RefObject, useEffect } from 'react'

/**
 * Workaround for preventing clicks propagating
 * to elements behind the button clicked
 * Inspired from this issue https://github.com/adobe/react-spectrum/issues/1513
 * @param buttonRef Ref of the button
 */
export const usePreventClickAfterTouchOnButton = (
	buttonRef: RefObject<HTMLButtonElement>
) => {
	useEffect(() => {
		const button = buttonRef.current
		if (button?.nodeName !== 'BUTTON') {
			return
		}

		const preventDefault = (e: HTMLElementEventMap['touchend']) => {
			e.preventDefault()
		}

		button.addEventListener('touchend', preventDefault, { passive: false })
	}, [buttonRef])
}
