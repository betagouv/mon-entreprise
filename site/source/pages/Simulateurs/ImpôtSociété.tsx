import { updateSituation } from 'Actions/actions'
import RuleInput from 'Components/conversation/RuleInput'
import Value from 'Components/EngineValue'
import Notifications from 'Components/Notifications'
import { SimulationGoal, SimulationGoals } from 'Components/Simulation'
import { FromTop } from 'Components/ui/animate'
import Warning from 'Components/ui/WarningBlock'
import useSimulationConfig from 'Components/utils/useSimulationConfig'
import { Body, Intro } from 'DesignSystem/typography/paragraphs'
import { Trans } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { SimulationConfig } from 'Reducers/rootReducer'
import { situationSelector } from 'Selectors/simulationSelectors'
import styled from 'styled-components'
import { TrackPage } from '../../ATInternetTracking'

const ISConfig = {
	'unité par défaut': '€/an',
	situation: {
		'entreprise . imposition': "'IS'",
		'entreprise . imposition . IS . impôt sur les sociétés . éligible taux réduit':
			'oui',
		"entreprise . chiffre d'affaires . franchise de TVA": 'non',
	},
} as SimulationConfig

export default function ISSimulation() {
	useSimulationConfig(ISConfig)

	return (
		<>
			<Warning
				localStorageKey={'app::simulateurs:warning-folded:v1:impôt-societé'}
			>
				<Body>
					<Trans i18nKey="impotSociété.warning">
						Ce simulateur s’adresse aux{' '}
						<abbr title="Très Petite Entreprises">TPE</abbr> : il prend en
						compte les taux réduits de l’impôt sur les sociétés.
					</Trans>
				</Body>
			</Warning>
			<Notifications />
			<SimulationGoals
				toggles={<ExerciceDate />}
				legend="Résultat imposable de l'entreprise"
			>
				<SimulationGoal dottedName="entreprise . imposition . IS . résultat imposable" />
			</SimulationGoals>
			<Explanations />
		</>
	)
}

const ExerciceDateContainer = styled.div`
	display: flex;
	justify-content: flex-end;
	align-items: center;
	gap: 0.5rem;
	margin-top: 1rem;
`

function ExerciceDate() {
	const dispatch = useDispatch()
	return (
		<ExerciceDateContainer>
			<RuleInput
				dottedName={'entreprise . exercice . début'}
				showDefaultDateValue
				onChange={(x) =>
					dispatch(updateSituation('entreprise . exercice . début', x))
				}
			/>{' '}
			<RuleInput
				dottedName={'entreprise . exercice . fin'}
				showDefaultDateValue
				onChange={(x) =>
					dispatch(updateSituation('entreprise . exercice . fin', x))
				}
			/>
		</ExerciceDateContainer>
	)
}

const ExplanationsContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-items: center;
	align-items: center;
`

function Explanations() {
	const situation = useSelector(situationSelector)

	const showResult =
		situation['entreprise . imposition . IS . résultat imposable']

	if (!showResult) {
		return <TrackPage name="accueil" />
	}

	return (
		<FromTop>
			<TrackPage name="simulation terminée" />
			<ExplanationsContainer>
				<Intro>
					<Value
						expression="entreprise . imposition . IS . impôt sur les sociétés"
						displayedUnit="€"
						className="payslip__total"
					/>
				</Intro>
				<Body
					className="notice"
					css={`
						margin-top: -1rem;
					`}
				>
					<Trans>Montant de l'impôt sur les sociétés</Trans>
				</Body>
			</ExplanationsContainer>
		</FromTop>
	)
}
