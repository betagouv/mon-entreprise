import { useEffect } from 'react'

export const useScrollToHash = (
	options: ScrollIntoViewOptions = { behavior: 'smooth', block: 'start' }
) => {
	useEffect(() => {
		const { hash } = window.location
		if (hash) {
			const id = hash.replace('#', '')
			const element = document.getElementById(id)
			if (!element) {
				return
			}
			element.scrollIntoView(options)
		}
	}, [window.location.hash])
}
