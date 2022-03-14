import { Grid } from '@mui/material'
import Emoji from '@/components/utils/Emoji'
import { Button } from '@/design-system/buttons'
import { Spacing } from '@/design-system/layout'
import PopoverWithTrigger from '@/design-system/PopoverWithTrigger'
import { CurrentSimulatorDataContext } from '../../pages/Simulateurs/metadata'
import { useContext } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import {
	companySituationSelector,
	situationSelector,
} from '@/selectors/simulationSelectors'
import styled from 'styled-components'
import { TrackingContext } from '../../ATInternetTracking'
import { useParamsFromSituation } from '../utils/useSearchParamsSimulationSharing'
import { ShareSimulationPopup } from './ShareSimulationPopup'
import { PlacesDesEntreprisesButton } from '../PlaceDesEntreprises'
import { Link } from '@/design-system/typography/link'

export function useUrl() {
	const language = useTranslation().i18n.language
	const situation = {
		...useSelector(situationSelector),
		...useSelector(companySituationSelector),
	}
	delete situation['entreprise . SIREN']
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
				gap={4}
				justifyContent="space-evenly"
			>
				<Grid item xs={12} sm="auto">
					<PopoverWithTrigger
						title={t('shareSimulation.modal.title', 'Votre lien de partage')}
						trigger={(buttonProps) => (
							<Link
								{...buttonProps}
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
								<Emoji emoji="🔗" />{' '}
								<Trans i18nKey="shareSimulation.banner">
									Générer un lien de partage
								</Trans>
							</Link>
						)}
						small
					>
						<ShareSimulationPopup url={url} />
					</PopoverWithTrigger>
				</Grid>

				{typeof window.print === 'function' && (
					<Grid item xs={12} sm="auto">
						<Link onPress={() => window.print()}>
							<Emoji emoji="🖨" />{' '}
							<Trans i18nKey="ExportSimulation.Banner">
								Imprimer ou sauvegarder en PDF
							</Trans>
						</Link>
					</Grid>
				)}

				<Grid item xs={12} sm="auto">
					<PlacesDesEntreprisesButton pathname="/aide-entreprise/rh-mon-entreprise-urssaf-fr/theme/recrutement-formation#section-breadcrumbs" />
				</Grid>
			</Grid>
		</>
	)
}
