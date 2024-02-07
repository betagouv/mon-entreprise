import { useEffect, useRef } from 'react'

type Params = {
	onEnter: () => void
	onExit: () => void
	delay: number
}

export function useDelayedExit({
	onEnter = () => {},
	onExit = () => {},
	delay = 100,
}: Params) {
	const timeout = useRef<NodeJS.Timeout | undefined>()

	const cancelTimeout = () => {
		if (timeout.current) {
			clearTimeout(timeout.current)
		}
	}

	const handleEnter = () => {
		cancelTimeout()
		onEnter()
	}
	const handleExit = () => {
		timeout.current = setTimeout(() => onExit(), delay)
	}

	useEffect(() => cancelTimeout, [])

	return {
		handleEnter,
		handleExit,
	}
}
