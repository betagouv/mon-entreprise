import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function useScrollToHash() {
	const location = useLocation()

	useEffect(() => {
		const { hash } = location
		if (hash) {
			const id = hash.replace('#', '')
			const element = document.getElementById(id)
			if (!element) {
				return
			}
			element.scrollIntoView()
		}
	}, [location])
}
