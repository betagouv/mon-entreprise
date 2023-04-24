import { Trans, useTranslation } from 'react-i18next'
import { useMatch } from 'react-router-dom'
import styled from 'styled-components'

import { Button } from '@/design-system/buttons'
import { Grid } from '@/design-system/layout'
import { useSitePaths } from '@/sitePaths'

export const stepOrder = [
	'recherche-activité',
	'détails-activité',
	'département',
	'lucratif',
	'associé',
	'rémunération',
	'statuts',
	'résultat',
] as const

type Step = (typeof stepOrder)[number]

function useCurrentStep() {
	const { relativeSitePaths, absoluteSitePaths } = useSitePaths()
	const localizedStep = useMatch(
		`${absoluteSitePaths.assistants['choix-du-statut'].index}/:step`
	)?.params.step
	if (!localizedStep) {
		return null
	}

	const currentStep = Object.entries(
		relativeSitePaths.assistants['choix-du-statut']
	).find(
		([, value]) => value === localizedStep
	)?.[0] as keyof (typeof relativeSitePaths.assistants)['choix-du-statut']

	if (!stepOrder.includes(currentStep as Step)) {
		return null
	}

	return currentStep as Step
}

export default function Navigation({
	currentStepIsComplete,
	nextStepLabel,
	onNextStep,
}: {
	currentStepIsComplete: boolean
	nextStepLabel?: string
	onNextStep?: () => void
}) {
	const { t } = useTranslation()
	const { absoluteSitePaths } = useSitePaths()

	const currentStep = useCurrentStep()
	if (!currentStep) {
		return null
	}
	const nextStep = stepOrder[stepOrder.indexOf(currentStep) + 1]
	const previousStep = stepOrder[stepOrder.indexOf(currentStep) - 1]

	return (
		<StyledNavigation>
			<Grid container spacing={2}>
				<Grid item>
					<Button
						light
						color={'secondary'}
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
							to={absoluteSitePaths.assistants['choix-du-statut'][nextStep]}
							isDisabled={!currentStepIsComplete}
							aria-label={t("Suivant, passer à l'étape suivante")}
						>
							{nextStepLabel || <Trans>Suivant</Trans>}{' '}
							<span aria-hidden>→</span>
						</Button>
					</Grid>
				)}
			</Grid>
		</StyledNavigation>
	)
}

const StyledNavigation = styled.div`
	position: sticky;
	padding: ${({ theme }) => theme.spacings.lg} 1rem;
	margin: 0 -1rem;
	bottom: 0;
	background: ${({ theme }) => theme.colors.extended.grey[100]};
	z-index: 1;
	/* box-shadow: ${({ theme }) => theme.elevations[6]}; */
`
