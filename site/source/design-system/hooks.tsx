import { useEffect, useState } from 'react'

import { useIsEmbedded } from '@/hooks/useIsEmbedded'
import { getIframeOffset } from '@/utils/index'

export const useIFrameOffset = () => {
	const [offsetTop, setOffset] = useState<number>()
	const isEmbedded = useIsEmbedded()

	useEffect(() => {
		if (!isEmbedded) {
			return
		}
		void getIframeOffset().then(setOffset)
	}, [isEmbedded])

	return offsetTop
}
