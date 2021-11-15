import Emoji from 'Components/utils/Emoji'
import { Button } from 'DesignSystem/buttons'
import PopoverWithTrigger from 'DesignSystem/PopoverWithTrigger'
import { useContext } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { situationSelector } from 'Selectors/simulationSelectors'
import styled from 'styled-components'
import { TrackingContext } from '../../ATInternetTracking'
import { useParamsFromSituation } from '../utils/useSearchParamsSimulationSharing'
import { ShareSimulationPopup } from './ShareSimulationPopup'

export function useUrl() {
	const situation = useSelector(situationSelector)
	const searchParams = useParamsFromSituation(situation)
	searchParams.set('utm_source', 'sharing')
	return [
		window.location.origin,
		window.location.pathname.replace('iframes/', ''),
		'?',
		searchParams.toString(),
	].join('')
}

const ButtonLabel = styled.span`
	margin-left: 1rem;
`

export default function ShareOrSaveSimulationBanner() {
	const { t } = useTranslation()
	const tracker = useContext(TrackingContext)
	const shareAPIAvailable = !!window?.navigator?.share
	const url = useUrl()
	const startSharing = async () => {
		if (shareAPIAvailable) {
			await window.navigator.share({
				title: document.title,
				text: t(
					'shareSimulation.navigatorShare',
					'Ma simulation Mon Entreprise'
				),
				url,
			})
		}
	}

	return (
		<SharingTools className=" print-display-none">
			<PopoverWithTrigger
				title={t('shareSimulation.modal.title', 'Votre lien de partage')}
				trigger={(buttonProps) => (
					<Button
						{...buttonProps}
						light
						size="XS"
						onPress={(e) => {
							tracker.click.set({
								chapter1: 'feature:partage',
								type: 'action',
								name: 'démarré',
							})
							tracker.dispatch()
							startSharing()

							buttonProps?.onPress?.(e)
						}}
					>
						<Emoji emoji="🔗" />
						<ButtonLabel>
							<Trans i18nKey="shareSimulation.banner">
								Générer un lien de partage
							</Trans>
						</ButtonLabel>
					</Button>
				)}
			>
				<ShareSimulationPopup url={url} />
			</PopoverWithTrigger>

			<div>
				<Button
					light
					size="XS"
					onPress={() => {
						window.print()
					}}
				>
					<Emoji
						css={`
							margin-right: 1rem;
						`}
						emoji="🖨"
					/>
					<ButtonLabel>
						<Trans i18nKey="ExportSimulation.Banner">
							Imprimer ou sauvegarder en PDF
						</Trans>
					</ButtonLabel>
				</Button>
			</div>
		</SharingTools>
	)
}

const SharingTools = styled.div`
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
	align-items: center;
	margin: 0.5rem 0;
`
