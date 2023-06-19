import { Trans, useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import { Button } from '@/design-system/buttons'
import { Grid, Spacing } from '@/design-system/layout'
import { useSitePaths } from '@/sitePaths'

import { useNextStep } from './useNextStep'

export default function Navigation({
	currentStepIsComplete,
	nextStepLabel,
	onNextStep,
	onPreviousStep,
	assistantIsCompleted = false,
}: {
	currentStepIsComplete: boolean
	nextStepLabel?: false | string
	onNextStep?: () => void
	onPreviousStep?: () => void
	assistantIsCompleted?: boolean
}) {
	const { t } = useTranslation()
	const nextStep = useNextStep()
	const navigate = useNavigate()
	const resultatPath =
		useSitePaths().absoluteSitePaths.assistants['choix-du-statut'].résultat

	return (
		<>
			<Spacing xs />
			<StyledNavigation>
				<Grid container spacing={2}>
					<Grid item>
						<Button
							light
							color={'secondary'}
							onPress={() => {
								onPreviousStep?.()
								navigate(-1)
							}}
						>
							<span aria-hidden>←</span> <Trans>Précédent</Trans>
						</Button>
					</Grid>
					{nextStep && !assistantIsCompleted && (
						<Grid item>
							<Button
								onPress={onNextStep}
								to={nextStep}
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
					{assistantIsCompleted && (
						<Grid item>
							<Button
								to={resultatPath}
								aria-label={t('Suivant, voir le résultat')}
							>
								{nextStepLabel || (
									<Trans>Enregistrer et voir le résultat</Trans>
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
