import { useEffect } from 'react'

export default function useScrollToTop() {
	useEffect(() => {
		try {
			window.scroll({
				top: 0,
				behavior: 'auto',
			})
		} catch (e) {
			window.scroll(0, 0)
		}
	}, [])
}
