import { IframeHandlers, IframeMessage } from '@/types/iframe-messages'

export function setupIframeMessageHandlers(
	iframe: HTMLIFrameElement
): IframeHandlers {
	const handleMessage = (evt: MessageEvent<IframeMessage>) => {
		if (evt.data.kind === 'resize-height') {
			iframe.style.height = `${evt.data.value}px`
		}

		if (evt.data.kind === 'get-offset') {
			const iframePosition = iframe.getBoundingClientRect()
			const offset = Math.max(iframePosition.top * -1, 0)
			iframe.contentWindow?.postMessage({ kind: 'offset', value: offset }, '*')
		}
	}

	window.addEventListener('message', handleMessage)

	return {
		cleanup: () => window.removeEventListener('message', handleMessage),
	}
}
