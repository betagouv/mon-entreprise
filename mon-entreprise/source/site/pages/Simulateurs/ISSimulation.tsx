import { setSimulationConfig, updateSituation } from 'Actions/actions'
import RuleInput from 'Components/conversation/RuleInput'
import Value from 'Components/EngineValue'
import Notifications from 'Components/Notifications'
import { SimulationGoal, SimulationGoals } from 'Components/SimulationGoals'
import Animate from 'Components/ui/animate'
import Warning from 'Components/ui/WarningBlock'
import { ThemeColorsContext } from 'Components/utils/colors'
import { useContext, useEffect } from 'react'
import emoji from 'react-easy-emoji'
import { Trans } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { situationSelector } from 'Selectors/simulationSelectors'

const config = {
	color: '',
	'unité par défaut': '€/an',
	situation: {},
}
export default function ISSimulation() {
	const dispatch = useDispatch()
	const { color } = useContext(ThemeColorsContext)
	useEffect(() => {
		// HACK The config is mutated to avoid reseting the situation everytime the
		// component is loaded. `setSimulationConfig` relies on config object
		// equality. The `setSimulationConfig` design should be improved.
		config.color = color
		dispatch(setSimulationConfig(config))
	}, [])

	return (
		<>
			<Warning
				localStorageKey={'app::simulateurs:warning-folded:v1:impôt-societé'}
			>
				<Trans i18nKey="impotSociété.warning">
					Ce simulateur s’adresse aux{' '}
					<abbr title="Très Petite Entreprises">TPE</abbr> : il prend en compte
					les taux réduits de l’impôt sur les sociétés.
				</Trans>
			</Warning>
			<ExerciceDate />
			<Notifications />
			<SimulationGoals className="plain">
				<SimulationGoal dottedName="entreprise . bénéfice" autoFocus={true} />
			</SimulationGoals>
			<Explanations />
		</>
	)
}

function ExerciceDate() {
	const dispatch = useDispatch()
	return (
		<p
			css={`
				display: flex;
				justify-content: flex-end;
				align-items: center;
				opacity: 0.85;
				font-style: italic;

				input {
					border: none;
					border-radius: 0;
					padding: 0;
					margin: 0 10px 6px 10px;
					border-bottom: 2px dotted var(--color);
				}
			`}
		>
			{emoji('📆')}&nbsp;
			<Trans i18nKey="impotSociété.exerciceDates">
				Exercice du{' '}
				<RuleInput
					dottedName={'entreprise . exercice . début'}
					onChange={(x) =>
						dispatch(updateSituation('entreprise . exercice . début', x))
					}
				/>{' '}
				au{' '}
				<RuleInput
					dottedName={'entreprise . exercice . fin'}
					onChange={(x) =>
						dispatch(updateSituation('entreprise . exercice . fin', x))
					}
				/>
			</Trans>
		</p>
	)
}

function Explanations() {
	const situation = useSelector(situationSelector)
	const showResult = situation['entreprise . bénéfice']
	if (!showResult) {
		return null
	}
	return (
		<Animate.fromTop>
			<p
				className="ui__ lead card light-bg"
				css={`
					width: fit-content;
					text-align: center;
					margin: 2rem auto;
					padding: 1rem 4rem;

					strong {
						font-size: 1.3em;
					}
				`}
			>
				<strong>
					<Value
						expression="entreprise . impôt sur les sociétés"
						displayedUnit="€"
						className="payslip__total"
					/>
				</strong>
				<br />
				<span className="ui__ notice">
					<Trans>Montant de l'impôt sur les sociétés</Trans>
				</span>
			</p>
		</Animate.fromTop>
	)
}
