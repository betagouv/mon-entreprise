import { useEffect } from 'react'

/**
 * @deprecated Prefer the use of useIsEmbedded() if possible  */
export function isIframe() {
	try {
		return window.self !== window.top
	} catch (e) {
		return true
	}
}

export function useIframeResizer() {
	useEffect(() => {
		// The code below communicate with the iframe.js script on a host site
		// to automatically resize the iframe when its inner content height
		// change.

		if (!isIframe()) {
			return
		}

		const minHeight = 700 // Also used in iframe.js
		const observer = new ResizeObserver(([entry]) => {
			const value = Math.max(minHeight, entry.contentRect.height)
			window.parent?.postMessage({ kind: 'resize-height', value }, '*')
		})
		observer.observe(window.document.body)

		return () => observer.disconnect()
	}, [])
}
