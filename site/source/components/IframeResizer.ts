import { useEffect } from 'react'

import { useIsEmbedded } from '@/hooks/useIsEmbedded'

export function IframeResizer() {
	const isEmbedded = useIsEmbedded()
	useEffect(() => {
		// The code below communicate with the iframe.js script on a host site
		// to automatically resize the iframe when its inner content height
		// change.

		if (!isEmbedded) {
			return
		}

		const minHeight = 700 // Also used in iframe.js
		const observer = new ResizeObserver(([entry]) => {
			const value = Math.max(minHeight, entry.contentRect.height)
			window.parent?.postMessage({ kind: 'resize-height', value }, '*')
		})
		observer.observe(window.document.body)

		return () => observer.disconnect()
	}, [isEmbedded])

	return null
}
