import PageFeedback from '@/components/Feedback'
import { FromBottom } from '@/components/ui/animate'
import DefaultHelmet from '@/components/utils/DefaultHelmet'
import Emoji from '@/components/utils/Emoji'
import { ScrollToTop } from '@/components/utils/Scroll'
import { Button } from '@/design-system/buttons'
import { Grid } from '@/design-system/layout'
import { Strong } from '@/design-system/typography'
import { H1, H2, H3 } from '@/design-system/typography/heading'
import { Link } from '@/design-system/typography/link'
import { Body, SmallBody } from '@/design-system/typography/paragraphs'
import { useSitePaths } from '@/sitePaths'
import { useContext } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Navigate } from 'react-router-dom'
import { TrackPage } from '../../../ATInternetTracking'
import { ActiviteCard } from './ActiviteCard'
import illustration from './images/multitasking.svg'
import {
	activitésEffectuéesSelector,
	déclarationsSelector,
	nextActivitéSelector,
	régimeGénéralDisponibleSelector,
} from './selectors'
import { StoreContext } from './StoreContext'

export default function VotreSituation() {
	const { absoluteSitePaths } = useSitePaths()
	const { state } = useContext(StoreContext)
	const { t } = useTranslation()

	if (!activitésEffectuéesSelector(state).length) {
		return <Navigate to={'..'} replace />
	}

	const titre = t(
		'économieCollaborative.obligations.titre',
		'Que dois-je faire pour être en règle ?'
	)

	const nextActivité = nextActivitéSelector(state)
	if (nextActivité) {
		return <Navigate to={'../' + nextActivité} replace />
	}

	const déclarations = déclarationsSelector(state)
	const régimeGénéralDisponible = activitésEffectuéesSelector(state).some(
		(activité) => régimeGénéralDisponibleSelector(state, activité)
	)

	return (
		<FromBottom>
			<ScrollToTop />
			<TrackPage name="simulation terminée" />
			<DefaultHelmet>
				<title>{titre}</title>
			</DefaultHelmet>
			<H1>{titre}</H1>
			<div css="text-align: center">
				<img css="height: 200px" src={illustration} alt="" />
			</div>
			<section>
				{déclarations.RÉGIME_GÉNÉRAL_DISPONIBLE.length > 0 && (
					<>
						<Trans i18nKey="économieCollaborative.obligations.pro">
							<H2>Déclarer en tant qu'activité professionnelle</H2>
							<Body>
								Vos revenus sont considérés comme revenus professionnels, ils
								sont soumis aux cotisations sociales. En contrepartie, ils
								ouvrent vos droit à des prestations sociales (retraite,
								assurance maladie, maternité, etc.).
							</Body>
						</Trans>
						<ActivitéList activités={déclarations.RÉGIME_GÉNÉRAL_DISPONIBLE} />
						<Trans i18nKey="économieCollaborative.obligations.entreprise">
							<H3>Avec une entreprise</H3>
							<Body>
								Si vous possédez déjà une activité déclarée, vous pouvez ajouter
								ces revenus à ceux de l'entreprise. Il vous faudra seulement
								vérifier que son objet social est compatible avec les activités
								concernées (et le changer si besoin). Sinon, vous aurez à créer
								une nouvelle entreprise.
							</Body>
							<Button to={absoluteSitePaths.créer.index} light>
								Créer une entreprise
							</Button>
						</Trans>

						{régimeGénéralDisponible && (
							<Trans i18nKey="économieCollaborative.obligations.régimeGénéral">
								<H3>Avec l'option régime général</H3>
								<Body>
									Pour certaines activités, vous pouvez déclarer vos revenus
									directement sur le site de l'Urssaf. C'est une option
									intéressante si vous ne souhaitez pas créer d'entreprise ou
									modifier une entreprise existante. Vous devrez dans tous les
									cas déclarer ces revenus aux impôts.
								</Body>
								<Button
									light
									href="https://www.urssaf.fr/portail/home/espaces-dedies/activites-relevant-de-leconomie/vous-optez-pour-le-regime-genera/comment-simmatriculer.html"
								>
									Déclarer au régime général
								</Button>
							</Trans>
						)}
					</>
				)}
				{déclarations.IMPOSITION.length > 0 && (
					<>
						<Trans i18nKey="économieCollaborative.obligations.impôts">
							<H2>Déclarer vos revenus aux impôts</H2>
							<Body>
								Pour ces activités, vous avez uniquement besoin de déclarer vos
								revenus sur votre feuille d'imposition. Pour en savoir plus,
								vous pouvez consulter la{' '}
								<Link
									aria-label="page dédiée sur impots.gouv.fr, nouvelle fenêtre"
									href="https://www.impots.gouv.fr/portail/particulier/questions/comment-declarer-mes-revenus-dactivites-annexes-telles-que-le-co-voiturage-la"
								>
									page dédiée sur impots.gouv.fr
								</Link>
								.
							</Body>
						</Trans>
						<ActivitéList activités={déclarations.IMPOSITION} />
					</>
				)}

				{déclarations.AUCUN.length > 0 && (
					<>
						<Trans i18nKey="économieCollaborative.obligations.aucune">
							<H2>Rien à faire</H2>
							<Body>
								Vous n'avez pas besoin de déclarer vos revenus pour ces
								activités.
							</Body>
						</Trans>
						<ActivitéList activités={déclarations.AUCUN} />
					</>
				)}
			</section>
			<PageFeedback
				customMessage={<Trans>Êtes vous satisfait de cet assistant ?</Trans>}
			/>
			<SmallBody>
				<Emoji emoji="🏗️" />{' '}
				<Trans i18nKey="économieCollaborative.WIP">
					<Strong>Cet assistant est en cours de développement.</Strong>{' '}
					N'hésitez pas à nous faire part de toute vos remarques, idées,
					questions en cliquant sur le bouton "Faire une suggestion" en bas de
					la page.
				</Trans>
			</SmallBody>
		</FromBottom>
	)
}

const ActivitéList = ({ activités }: { activités: string[] }) => {
	const { state } = useContext(StoreContext)

	return (
		<Grid container spacing={2}>
			{activités.map((title) => (
				<Grid item key={title} xs={6} md={4}>
					<ActiviteCard
						title={title}
						answered
						label={
							régimeGénéralDisponibleSelector(state, title) ? (
								<Trans i18nKey="économieCollaborative.obligations.régimeGénéralDisponible">
									Régime général disponible
								</Trans>
							) : null
						}
					/>
				</Grid>
			))}
		</Grid>
	)
}
