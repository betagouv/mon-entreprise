import { Grid } from '@mui/material'
import { FromBottom } from 'Components/ui/animate'
import { ScrollToTop } from 'Components/utils/Scroll'
import { SitePathsContext } from 'Components/utils/SitePathsContext'
import { Button } from 'DesignSystem/buttons'
import { H1, H2, H3 } from 'DesignSystem/typography/heading'
import { Link } from 'DesignSystem/typography/link'
import { Body } from 'DesignSystem/typography/paragraphs'
import { useContext } from 'react'
import { Helmet } from 'react-helmet-async'
import { Trans, useTranslation } from 'react-i18next'
import { Redirect } from 'react-router-dom'
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
	const sitePaths = useContext(SitePathsContext)
	const { state } = useContext(StoreContext)
	const { t } = useTranslation()
	if (!activitésEffectuéesSelector(state).length) {
		return <Redirect to={sitePaths.simulateurs.économieCollaborative.index} />
	}
	const titre = t(
		'économieCollaborative.obligations.titre',
		'Que dois-je faire pour être en règle ?'
	)

	const nextActivité = nextActivitéSelector(state)
	if (nextActivité) {
		return (
			<Redirect
				to={
					sitePaths.simulateurs.économieCollaborative.index + '/' + nextActivité
				}
			/>
		)
	}

	const déclarations = déclarationsSelector(state)
	const régimeGénéralDisponible = activitésEffectuéesSelector(state).some(
		(activité) => régimeGénéralDisponibleSelector(state, activité)
	)

	return (
		<FromBottom>
			<ScrollToTop />
			<TrackPage name="simulation terminée" />
			<Helmet>
				<title>{titre}</title>
			</Helmet>
			<H1>{titre}</H1>
			<div css="text-align: center">
				<img css="height: 200px" src={illustration} />
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
							<Button to={sitePaths.créer.index} light>
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
								<Link href="https://www.impots.gouv.fr/portail/particulier/questions/comment-declarer-mes-revenus-dactivites-annexes-telles-que-le-co-voiturage-la">
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
