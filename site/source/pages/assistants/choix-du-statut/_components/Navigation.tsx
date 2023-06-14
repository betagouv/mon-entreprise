import { Trans, useTranslation } from 'react-i18next'
import { useMatch } from 'react-router-dom'
import styled from 'styled-components'

import { Button } from '@/design-system/buttons'
import { Grid } from '@/design-system/layout'
import { RelativeSitePaths, useSitePaths } from '@/sitePaths'

type ChoixStatut = RelativeSitePaths['assistants']['choix-du-statut']
type Step = keyof ChoixStatut

export const stepOrder: readonly Step[] = [
	'recherche-activité',
	'détails-activité',
	'département',
	'lucratif',
	'associé',
	'rémunération',
	'statuts',
	'résultat',
] as const

function useCurrentStep() {
	const { relativeSitePaths, absoluteSitePaths } = useSitePaths()
	const localizedStep = useMatch(
		`${absoluteSitePaths.assistants['choix-du-statut'].index}/:step`
	)?.params.step
	if (!localizedStep) {
		return null
	}

	const entries = Object.entries(
		relativeSitePaths.assistants['choix-du-statut']
	) as [Step, ChoixStatut[Step]][]

	const [currentStep] =
		entries.find(([, value]) => value === localizedStep) ?? []

	if (!currentStep || !stepOrder.includes(currentStep)) {
		return null
	}

	return currentStep
}

export default function Navigation({
	currentStepIsComplete,
	nextStepLabel,
	onNextStep,
	onPreviousStep,
}: {
	currentStepIsComplete: boolean
	nextStepLabel?: false | string
	onNextStep?: () => void
	onPreviousStep?: () => void
}) {
	const { t } = useTranslation()
	const { absoluteSitePaths } = useSitePaths()

	const currentStep = useCurrentStep()
	if (!currentStep) {
		return null
	}

	type PartialStep = Step | undefined
	const nextStep = stepOrder[stepOrder.indexOf(currentStep) + 1] as PartialStep
	const previousStep = stepOrder[
		stepOrder.indexOf(currentStep) - 1
	] as PartialStep

	return (
		<>
			<StyledNavigation>
				<Grid container spacing={2}>
					<Grid item>
						<Button
							light
							color={'secondary'}
							onPress={onPreviousStep}
							to={
								absoluteSitePaths.assistants['choix-du-statut'][
									previousStep || 'index'
								]
							}
						>
							<span aria-hidden>←</span> <Trans>Précédent</Trans>
						</Button>
					</Grid>
					{nextStep && (
						<Grid item>
							<Button
								onPress={onNextStep}
								// Probleme de desynchronisation entre le onpress et le to, le onpress n'est pas toujours appelé avant le to
								to={absoluteSitePaths.assistants['choix-du-statut'][nextStep]}
								// est ce qu'on devrait pas utiliser les parametres de l'url comme ca ?
								// to={{
								// 	pathname:
								// 		absoluteSitePaths.assistants['choix-du-statut'][nextStep],
								// 	search: createSearchParams({
								// 		codeAPE: '6201Z',
								// 	}).toString(),
								// }}
								isDisabled={!currentStepIsComplete}
								aria-label={t("Suivant, passer à l'étape suivante")}
							>
								{nextStepLabel || (
									<Trans>Enregistrer et passer à la suite</Trans>
								)}{' '}
								<span aria-hidden>→</span>
							</Button>
						</Grid>
					)}
				</Grid>
			</StyledNavigation>
			<Shadow />
		</>
	)
}

const StyledNavigation = styled.div`
	display: flex;
	align-items: center;
	height: 110px;
	position: sticky;
	padding: ${({ theme }) => theme.spacings.lg} 1rem;
	margin: 0 -1rem;
	bottom: 0;
	background: ${({ theme }) =>
		theme.darkMode
			? theme.colors.extended.dark[800]
			: theme.colors.extended.grey[100]};
	z-index: 2;
`

const Shadow = styled.div`
	z-index: 1;
	position: sticky;
	bottom: 35px;
	transform: translateY(-200%);
	clip-path: inset(-5px 0px -5px -5px);
	height: 25px;
	padding: 0;
	margin: 0;
	background: transparent;
	box-shadow: ${({ theme }) =>
		theme.darkMode ? theme.elevationsDarkMode[6] : theme.elevations[6]};

	/* debug 
	/* background: red; */
`
