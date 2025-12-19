import { Trans } from 'react-i18next'
import { css, styled } from 'styled-components'

import { TrackPage } from '@/components/ATInternetTracking'
import { Button, Grid, Spacing } from '@/design-system'
import { RelativeSitePaths, useSitePaths } from '@/sitePaths'

import { useCurrentStep, useNextStep, usePreviousStep } from './useSteps'

type Statuts = Exclude<
	keyof RelativeSitePaths['assistants']['choix-du-statut']['résultat'],
	'index'
>

export default function Navigation({
	currentStepIsComplete,
	nextStepLabel,
	onNextStep,
	onPreviousStep, // TODO : prefer resetOnLeave
	assistantIsCompleted = false,
	children,
	small = false,
}: {
	currentStepIsComplete: boolean
	nextStepLabel?: false | string
	onNextStep?: () => void
	onPreviousStep?: () => void
	assistantIsCompleted?: false | Statuts
	children?: React.ReactNode
	small?: boolean
}) {
	const nextStep = useNextStep()
	const currentStep = useCurrentStep()
	const previousStep = usePreviousStep()
	const choixDuStatutPath =
		useSitePaths().absoluteSitePaths.assistants['choix-du-statut']

	return (
		<>
			<TrackPage chapter3="pas_a_pas" name={currentStep} />
			{!small && <Spacing xs />}
			<StyledNavigation $small={small}>
				<Grid
					container
					spacing={2}
					style={{
						flexWrap: 'wrap-reverse',
					}}
				>
					{children && (
						<Grid item xs={12}>
							{children}
						</Grid>
					)}
					<Grid item xs={12} sm="auto">
						<Button
							light
							size={small ? 'XS' : 'MD'}
							color={'secondary'}
							to={choixDuStatutPath[previousStep]}
							onPress={onPreviousStep}
						>
							<span aria-hidden>←</span> <Trans>Précédent</Trans>
						</Button>
					</Grid>
					{nextStep && !assistantIsCompleted && (
						<Grid item xs={12} sm="auto">
							<Button
								size={small ? 'XS' : 'MD'}
								onPress={onNextStep}
								to={choixDuStatutPath[nextStep]}
								isDisabled={!currentStepIsComplete}
							>
								{nextStepLabel || <Trans>Enregistrer et continuer</Trans>}{' '}
								<span aria-hidden>→</span>
							</Button>
						</Grid>
					)}
					{assistantIsCompleted && (
						<Grid item xs={12} sm="auto">
							<Button to={choixDuStatutPath['résultat'][assistantIsCompleted]}>
								{nextStepLabel || (
									<Trans>Enregistrer et voir le résultat</Trans>
								)}{' '}
								<span aria-hidden>→</span>
							</Button>
						</Grid>
					)}
				</Grid>
			</StyledNavigation>
			{!small && <Shadow />}
		</>
	)
}

const StyledNavigation = styled.div<{ $small: boolean }>`
	display: flex;
	align-items: center;
	${({ $small }) =>
		!$small &&
		css`
			height: fit-content;
		`}
	position: sticky;
	padding: ${({ theme, $small }) => theme.spacings[$small ? 'sm' : 'lg']} 1rem;
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
	bottom: 30px;
	transform: translateY(-200%);
	clip-path: inset(-5px 0px -5px -5px);
	height: 25px;
	padding: 0;
	margin: 0;
	background: transparent;
	box-shadow: ${({ theme }) =>
		theme.darkMode ? theme.elevationsDarkMode[6] : theme.elevations[6]};
`
