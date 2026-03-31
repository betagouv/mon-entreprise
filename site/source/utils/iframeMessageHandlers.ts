import { IframeHandlers, IframeMessage } from '@/types/iframe-messages'

export function setupIframeMessageHandlers(
	iframe: HTMLIFrameElement
): IframeHandlers {
	const handleMessage = (evt: MessageEvent<IframeMessage>) => {
		if (evt.data.kind === 'resize-height') {
			iframe.style.height = `${evt.data.value}px`
		}

		if (evt.data.kind === 'get-offset') {
			const { top, height } = iframe.getBoundingClientRect()
			// Modale de retour =~ 45 rem de haut
			const modalHeight =
				45 * parseFloat(getComputedStyle(document.documentElement).fontSize)
			let offset = 0
			// Haut de l'iframe est hors de l'écran
			if (top < 0) {
				if (height + top > modalHeight) {
					// Il y a la place d'afficher la modale :
					// on l'affiche en haut de la partie visible de l'iframe
					offset = top * -1
				} else {
					// Il n'y a pas la place :
					// on l'affiche au-dessus du bas de l'iframe
					offset = height - modalHeight
				}
			}
			iframe.contentWindow?.postMessage({ kind: 'offset', value: offset }, '*')
		}
	}

	window.addEventListener('message', handleMessage)

	return {
		cleanup: () => window.removeEventListener('message', handleMessage),
	}
}
