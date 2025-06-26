import { useEffect, useState } from 'react'

/**
	A hook that returns a boolean indicating if all ongoing computation are done.
	 Uses the requestIdleCallback API.
 */
export const useEngineIsIdle = () => {
	const [isIdle, setIsIdle] = useState(false)

	useEffect(() => {
		if (window.requestIdleCallback === undefined) {
			const timeoutId = setTimeout(() => {
				setIsIdle(true)
			}, 0)

			return () => {
				clearTimeout(timeoutId)
			}
		}
		const idleCallback = window.requestIdleCallback(() => {
			setIsIdle(true)
		})

		return () => {
			window.cancelIdleCallback(idleCallback)
		}
	}, [])

	return isIdle
}
