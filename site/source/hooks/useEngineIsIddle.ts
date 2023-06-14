import { useEffect, useState } from 'react'

/**
	A hook that returns a boolean indicating if all ongoing computation are done.
	 Uses the requestIdleCallback API.
 */
export const useEngineIsIdle = () => {
	const [isIdle, setIsIdle] = useState(false)

	useEffect(() => {
		const idleCallback = window.requestIdleCallback(() => {
			setIsIdle(true)
		})

		return () => {
			window.cancelIdleCallback(idleCallback)
		}
	}, [])

	return isIdle
}
