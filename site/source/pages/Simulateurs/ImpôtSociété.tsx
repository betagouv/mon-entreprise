import { updateSituation } from '@/actions/actions'
import RuleInput from '@/components/conversation/RuleInput'
import Value from '@/components/EngineValue'
import Notifications from '@/components/Notifications'
import { SimulationGoal, SimulationGoals } from '@/components/Simulation'
import { FromTop } from '@/components/ui/animate'
import Warning from '@/components/ui/WarningBlock'
import useSimulationConfig from '@/components/utils/useSimulationConfig'
import { Body, Intro } from '@/design-system/typography/paragraphs'
import { SimulationConfig } from '@/reducers/rootReducer'
import { situationSelector } from '@/selectors/simulationSelectors'
import { useSitePaths } from '@/sitePaths'
import { Trans } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { TrackPage } from '../../ATInternetTracking'

const ISConfig = {
	'unité par défaut': '€/an',
	situation: {
		'entreprise . imposition': "'IS'",
		'entreprise . imposition . IS . éligible taux réduit': 'oui',
		'entreprise . TVA . franchise de TVA': 'non',
	},
} as SimulationConfig

export default function ISSimulation() {
	const { absoluteSitePaths } = useSitePaths()

	useSimulationConfig(ISConfig, { path: absoluteSitePaths.simulateurs.is })

	return (
		<>
			<Warning
				localStorageKey={'app::simulateurs:warning-folded:v1:impôt-societé'}
			>
				<Body>
					<Trans i18nKey="impotSociété.warning">
						Ce simulateur s’adresse aux{' '}
						<abbr title="Très Petites Entreprises">TPE</abbr> : il prend en
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
						expression="entreprise . imposition . IS . montant"
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
