import { useEffect } from 'react'

export default function DisableScroll() {
	useEffect(() => {
		document.documentElement.style.overflow = 'hidden'
		return () => {
			document.documentElement.style.overflow = ''
		}
	}, [])
	return null
}
