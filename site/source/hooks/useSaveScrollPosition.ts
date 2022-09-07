import { Action, Location } from 'history'
import { useEffect, useRef } from 'react'

const POP_ACTION_LABEL = 'POP'

export const useSaveScrollPosition = ({
	location,
	action,
	scrollY,
}: {
	location: Location
	action: Action
	scrollY: number
}) => {
	const previousPathname = useRef(location.pathname)

	// Scroll to position previously saved
	useEffect(() => {
		const scrollPosition = sessionStorage.getItem(location.pathname)

		if (scrollPosition && action === POP_ACTION_LABEL) {
			window.scrollTo(0, parseInt(scrollPosition))
		}
	}, [location, action, scrollY])

	// Save scroll position on location change
	useEffect(() => {
		sessionStorage.setItem(previousPathname.current, String(scrollY))
		previousPathname.current = location.pathname
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [location.pathname])
}
