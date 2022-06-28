import Emoji from '@/components/utils/Emoji'
import { PopoverWithTrigger } from '@/design-system'
import { Button } from '@/design-system/buttons'
import { Grid, Spacing } from '@/design-system/layout'
import {
	companySituationSelector,
	situationSelector,
} from '@/selectors/simulationSelectors'
import { useContext } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { TrackingContext } from '../../ATInternetTracking'
import { CurrentSimulatorDataContext } from '../../pages/Simulateurs/metadata'
import { PlaceDesEntreprisesButton } from '../PlaceDesEntreprises'
import { useParamsFromSituation } from '../utils/useSearchParamsSimulationSharing'
import { ShareSimulationPopup } from './ShareSimulationPopup'

export function useUrl() {
	const language = useTranslation().i18n.language
	const situation = {
		...useSelector(situationSelector),
		...useSelector(companySituationSelector),
	}

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

export default function ShareOrSaveSimulationBanner({
	share,
	print,
	placeDesEntreprises,
}: {
	share?: boolean
	print?: boolean
	placeDesEntreprises?: boolean
}) {
	const { t } = useTranslation()
	const tracker = useContext(TrackingContext)
	const shareAPIAvailable = !!window?.navigator?.share
	const url = useUrl()
	const startSharing = async () => {
		if (shareAPIAvailable) {
			try {
				await window.navigator.share({
					title: document.title,
					text: t(
						'shareSimulation.navigatorShare',
						'Ma simulation Mon Entreprise'
					),
					url,
				})
			} catch (e) {
				if (e instanceof Error && e.toString().includes('AbortError')) {
					return
				}
				// eslint-disable-next-line no-console
				console.error(e)
			}
		}
	}

	return (
		<>
			<Spacing lg />
			<Grid
				container
				className=" print-hidden"
				spacing={4}
				css={`
					justify-content: center;
				`}
			>
				{share && (
					<Grid item xs={12} sm="auto">
						<PopoverWithTrigger
							title={t('shareSimulation.modal.title', 'Votre lien de partage')}
							trigger={(buttonProps) => (
								<Button
									{...buttonProps}
									light
									size="XS"
									onPress={(e) => {
										tracker.events.send('click.action', {
											click_chapter1: 'feature:partage',
											click: 'démarré',
										})
										startSharing().catch(
											// eslint-disable-next-line no-console
											(err) => console.error(err)
										)

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
				)}

				{print && typeof window.print === 'function' && (
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

				{placeDesEntreprises && (
					<Grid item xs={12} sm="auto">
						<PlaceDesEntreprisesButton pathname="/aide-entreprise/rh-mon-entreprise-urssaf-fr/theme/recrutement-formation#section-breadcrumbs" />
					</Grid>
				)}
			</Grid>
		</>
	)
}
