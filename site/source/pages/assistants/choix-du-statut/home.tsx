import { Trans } from 'react-i18next'

import illustration from '@/assets/images/illustrations/créer.svg'
import PageHeader from '@/components/PageHeader'
import { ACCUEIL, TrackPage } from '@/components/PianoAnalytics'
import {
	Button,
	ClockIcon,
	Grid,
	Intro,
	SmallBody,
	Spacing,
	Strong,
} from '@/design-system'

import { useNextStep, useStepPaths } from './_components/useSteps'

export default function AccueilChoixStatut() {
	const nextStep = useNextStep()
	const { toStep } = useStepPaths()

	return (
		<>
			<TrackPage name={ACCUEIL} />

			<PageHeader picture={illustration}>
				<Intro>
					<Trans i18nKey="pages.assistants.choix-statut.home.intro">
						La première étape pour créer votre entreprise consiste à{' '}
						<Strong>choisir un statut juridique adapté à votre activité</Strong>
						. Les démarches administratives changent en fonction de ce dernier.
					</Trans>
				</Intro>
				<Spacing md />

				<Grid container spacing={3} style={{ alignItems: 'center' }}>
					<Grid item xs={12} sm={'auto'}>
						<Button size="XL" to={toStep(nextStep)}>
							<Trans i18nKey="pages.assistants.choix-statut.home.find-statut">
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
							<Trans i18nKey="pages.assistants.choix-statut.home.estimated-duration">
								Durée estimée : 10 minutes.
							</Trans>
						</SmallBody>
					</Grid>
				</Grid>
			</PageHeader>
			<Spacing xxl />
		</>
	)
}
