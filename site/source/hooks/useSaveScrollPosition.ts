import { debounce } from '@/utils'
import { useEffect } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'

const POP_ACTION_LABEL = 'POP'

export const useSaveScrollPosition = () => {
	const location = useLocation()
	const navigationType = useNavigationType()

	useEffect(() => {
		const scrollPosition = sessionStorage.getItem(location.pathname)

		if (scrollPosition && navigationType === POP_ACTION_LABEL) {
			window.scrollTo(0, parseInt(scrollPosition))
		}
	}, [location, navigationType])

	useEffect(() => {
		const saveScrollYPosition = debounce(100, () => {
			sessionStorage.setItem(location.pathname, String(window.scrollY))
		}) as (this: Window, ev: Event) => any

		window.addEventListener('scroll', saveScrollYPosition)

		return () => {
			window.removeEventListener('scroll', saveScrollYPosition)
		}
	}, [location.pathname])
}
