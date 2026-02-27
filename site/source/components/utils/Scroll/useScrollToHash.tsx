import { useEffect } from 'react'

import { useNavigation } from '@/lib/navigation'

export default function useScrollToHash() {
	const { locationHash } = useNavigation()

	useEffect(() => {
		if (locationHash) {
			const id = locationHash.replace('#', '')
			const element = document.getElementById(id)
			if (!element) {
				return
			}
			element.scrollIntoView()
		}
	}, [locationHash])
}
