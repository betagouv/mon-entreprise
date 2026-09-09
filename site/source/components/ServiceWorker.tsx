import { useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { styled } from 'styled-components'
import { useRegisterSW } from 'virtual:pwa-register/react'

import { useIsEmbedded } from '@/hooks/useIsEmbedded'
import { getItem, removeItem, setItem } from '@/storage/safeLocalStorage'

import { Message } from '../design-system'
import { Button, CloseButton } from '../design-system/buttons'
import { Body } from '../design-system/typography/paragraphs'

const PromptContainer = styled.div`
	position: fixed;
	bottom: 0;
	right: 0;
	z-index: 10000;
	min-height: initial !important;
`

const StyledSmallBody = styled(Body)`
	margin: 0.5rem 0.75rem 0.5rem 0;
`

const StyledMessage = styled(Message)`
	margin: 0 0.5rem 0.5rem 0.5rem !important;
	max-width: 450px;

	${Message.Wrapper} {
		display: flex;
		flex-direction: column;
		align-items: stretch;
	}
`

const StyledClosedButton = styled(CloseButton)`
	position: absolute;
	top: 0.375rem;
	right: 0.375rem;
`

const pwaPromptDelayKey = 'update-pwa-prompt-delay'

export const ServiceWorker = () => {
	const { t } = useTranslation()
	const [showPrompt, setShowPrompt] = useState(false)
	const isEmbedded = useIsEmbedded()

	const {
		needRefresh: [needRefresh, setNeedRefresh],
		updateServiceWorker,
	} = useRegisterSW({
		immediate: true,
		onRegistered: (r) => {
			// eslint-disable-next-line no-console
			console.log('=> SW Registered: ', r)

			// If no service worker is waiting, delete the old prompt delay
			if (!r?.waiting) {
				removeItem(pwaPromptDelayKey)
			}
		},

		onNeedRefresh() {
			const promptDelay = parseInt(getItem(pwaPromptDelayKey) ?? '0')

			// If we need a refresh and there is no prompt delay, create one in 3 days
			if (promptDelay === 0) {
				setItem(
					pwaPromptDelayKey,
					(Date.now() + 3 * 24 * 60 * 60 * 1000).toString()
				)
			}
			// If we need a refresh and the prompt delay has passed, show the prompt
			if (promptDelay > 0 && promptDelay < Date.now()) {
				setShowPrompt(true)
			}
		},

		onOfflineReady() {
			// eslint-disable-next-line no-console
			console.log('App is ready to work offline.')
		},

		onRegisterError: (error) => {
			// Avoid errors in Sentry:
			// "NotSupportedError: Failed to register a ServiceWorker: The user denied permission to use Service Worker."
			// "AbortError: The operation was aborted."
			// "AbortError: Failed to register a ServiceWorker for scope with script: Operation has been aborted"
			// "SecurityError: The operation is insecure."
			if (
				error instanceof Error &&
				/permission|aborted|insecure/i.test(error.message)
			) {
				return
			}
			// eslint-disable-next-line no-console
			console.error('SW registration error', error)
		},
	})
	if (isEmbedded) {
		return null
	}

	return (
		<PromptContainer>
			{needRefresh && showPrompt && (
				<StyledMessage type="info">
					<StyledSmallBody>
						<Trans>
							Nouveau contenu disponible, cliquez sur recharger pour mettre à
							jour la page.
						</Trans>{' '}
						<Button
							light
							size="XXS"
							onPress={() => void updateServiceWorker(true)}
						>
							{t('Recharger')}
						</Button>
					</StyledSmallBody>

					<StyledClosedButton
						onPress={() => setNeedRefresh(false)}
						aria-label={t('Fermer')}
					/>
				</StyledMessage>
			)}
		</PromptContainer>
	)
}
