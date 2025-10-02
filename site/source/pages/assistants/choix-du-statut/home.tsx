import { Trans, useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { ACCUEIL, TrackPage } from '@/components/ATInternetTracking'
import { EntrepriseDetails } from '@/components/entreprise/EntrepriseDetails'
import PageHeader from '@/components/PageHeader'
import { useEngine } from '@/components/utils/EngineContext'
import {
	Body,
	Button,
	ClockIcon,
	Grid,
	H3,
	Intro,
	Message,
	PopoverConfirm,
	SmallBody,
	Spacing,
	Strong,
} from '@/design-system'
import { useSitePaths } from '@/sitePaths'
import { resetCompany } from '@/store/actions/companyActions'

import { useNextStep } from './_components/useSteps'
import créerSvg from './_illustrations/créer.svg'

export default function AccueilChoixStatut() {
	const nextStep = useNextStep()
	const choixStatutPath =
		useSitePaths().absoluteSitePaths.assistants['choix-du-statut']
	const existingCompany = useEngine().evaluate('entreprise . SIREN').nodeValue!
	const dispatch = useDispatch()
	const { t } = useTranslation()

	return (
		<>
			<TrackPage name={ACCUEIL} />

			<PageHeader picture={créerSvg}>
				<Intro>
					<Trans i18nKey="choix-statut.home.intro">
						La première étape pour créer votre entreprise consiste à{' '}
						<Strong>choisir un statut juridique adapté à votre activité</Strong>
						. Les démarches administratives changent en fonction de ce dernier.
					</Trans>
				</Intro>
				{!existingCompany ? (
					<>
						<Spacing md />

						<Grid container spacing={3} style={{ alignItems: 'center' }}>
							<Grid item xs={12} sm={'auto'}>
								<Button size="XL" to={choixStatutPath[nextStep]}>
									<Trans i18nKey="choix-statut.home.find-statut">
										Trouver le bon statut
									</Trans>
								</Button>
							</Grid>

							<Grid item>
								<SmallBody
									$grey
									style={{
										display: 'flex',
										gap: '0.5rem',
									}}
								>
									<ClockIcon />
									<Trans i18nKey="choix-statut.home.estimated-duration">
										Durée estimée : 10 minutes.
									</Trans>
								</SmallBody>
							</Grid>
						</Grid>
					</>
				) : (
					<>
						<Message type="info" border={false}>
							<Trans i18nKey="choix-statut.home.warning-entreprise-existante">
								<H3>Une entreprise a déjà renseignée</H3>
								<Body>
									Pour accéder à l'assistant, il vous faut réinitialiser les
									données
								</Body>
							</Trans>
						</Message>
						<EntrepriseDetails />
						<PopoverConfirm
							trigger={(buttonProps) => (
								<Button
									light
									aria-label={t('Réinitialiser la situation enregistrée')}
									{...buttonProps}
								>
									{t('Réinitialiser')}
								</Button>
							)}
							onConfirm={() => dispatch(resetCompany())}
							small
							title={t(
								'Êtes-vous sûr de vouloir réinitialiser la situation enregistrée ?'
							)}
						/>
					</>
				)}
			</PageHeader>
			<Spacing xxl />
		</>
	)
}
