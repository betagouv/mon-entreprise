import { useEffect } from 'react'

import { useLocationHash } from '@/lib/navigation'

export default function useScrollToHash() {
	const hash = useLocationHash()

	useEffect(() => {
		if (hash) {
			const id = hash.replace('#', '')
			const element = document.getElementById(id)
			if (!element) {
				return
			}
			element.scrollIntoView()
		}
	}, [hash])
}
