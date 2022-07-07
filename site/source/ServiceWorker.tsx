import { useEffect } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { useRegisterSW } from 'virtual:pwa-register/react'
import { Message } from './design-system'
import { HideButton } from './design-system/banner'
import { Button } from './design-system/buttons'
import { Body } from './design-system/typography/paragraphs'

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

const StyledHideButton = styled.div`
	position: absolute;
	top: 0.375rem;
	right: 0.375rem;
`

export const ServiceWorker = () => {
	const { t } = useTranslation()

	const {
		offlineReady: [offlineReady, setOfflineReady],
		needRefresh: [needRefresh, setNeedRefresh],
		updateServiceWorker,
	} = useRegisterSW({
		onRegistered: (r) => {
			// eslint-disable-next-line no-console
			console.log('=> SW Registered: ', r)
		},
		onRegisterError: (error) => {
			// eslint-disable-next-line no-console
			console.log('SW registration error', error)
		},
	})

	useEffect(() => {
		if (offlineReady) {
			setOfflineReady(false)
			// eslint-disable-next-line no-console
			console.log('App is ready to work offline.')
		}
	}, [offlineReady, setOfflineReady])

	return (
		<PromptContainer>
			{needRefresh && (
				<StyledMessage type="info">
					<StyledSmallBody>
						<Trans>
							Nouveau contenu disponible, cliquez sur recharger pour mettre à
							jour la page.
						</Trans>{' '}
						<Button
							light
							size="XXS"
							onClick={() => void updateServiceWorker(true)}
						>
							{t('Recharger')}
						</Button>
					</StyledSmallBody>

					<StyledHideButton>
						<HideButton
							onClick={() => setNeedRefresh(false)}
							aria-label={t('Fermer')}
						>
							&times;
						</HideButton>
					</StyledHideButton>
				</StyledMessage>
			)}
		</PromptContainer>
	)
}
