import { Grid } from '@mui/material'
import Emoji from '@/components/utils/Emoji'
import { Button } from '@/design-system/buttons'
import { Spacing } from '@/design-system/layout'
import PopoverWithTrigger from '@/design-system/PopoverWithTrigger'
import { CurrentSimulatorDataContext } from '../../pages/Simulateurs/metadata'
import { useContext } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { situationSelector } from '@/selectors/simulationSelectors'
import styled from 'styled-components'
import { TrackingContext } from '../../ATInternetTracking'
import { useParamsFromSituation } from '../utils/useSearchParamsSimulationSharing'
import { ShareSimulationPopup } from './ShareSimulationPopup'
import { PlacesDesEntreprisesButton } from '../PlaceDesEntreprises'

export function useUrl() {
	const language = useTranslation().i18n.language
	const situation = useSelector(situationSelector)
	const searchParams = useParamsFromSituation(situation)
	const currentSimulatorData = useContext(CurrentSimulatorDataContext)

	const { path = '' } = currentSimulatorData ?? {}
	const siteUrl =
		language === 'fr'
			? import.meta.env.VITE_FR_BASE_URL
			: import.meta.env.VITE_EN_BASE_URL

	searchParams.set('utm_source', 'sharing')
	return siteUrl + path + '?' + searchParams.toString()
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
		<>
			<Spacing md />
			<Grid
				container
				className=" print-hidden"
				spacing={3}
				justifyContent="center"
			>
				<Grid item xs={12} sm="auto">
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
						small
					>
						<ShareSimulationPopup url={url} />
					</PopoverWithTrigger>
				</Grid>

				{typeof window.print === 'function' && (
					<Grid item xs={12} sm="auto">
						<Button light size="XS" onPress={() => window.print()}>
							<Emoji emoji="🖨" />
							<ButtonLabel>
								<Trans i18nKey="ExportSimulation.Banner">
									Imprimer ou sauvegarder en PDF
								</Trans>
							</ButtonLabel>
						</Button>
					</Grid>
				)}

				<Grid item xs={12} sm="auto">
					<PlacesDesEntreprisesButton pathname="/aide-entreprise/rh-mon-entreprise-urssaf-fr/theme/recrutement-formation#section-breadcrumbs" />
				</Grid>
			</Grid>
		</>
	)
}
