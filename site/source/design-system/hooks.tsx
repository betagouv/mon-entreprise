import { useEffect, useState } from 'react'

import { getIframeOffset } from '@/utils'

export const useIFrameOffset = () => {
	const [offsetTop, setOffset] = useState<number | null | undefined>(
		window.parent !== window ? undefined : null
	)
	useEffect(() => {
		if (window.parent === window) {
			return
		}
		void getIframeOffset().then(setOffset)
	}, [])

	return offsetTop
}
