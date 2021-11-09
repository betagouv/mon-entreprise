import { updateSituation } from 'Actions/actions'
import RuleInput from 'Components/conversation/RuleInput'
import Value from 'Components/EngineValue'
import Notifications from 'Components/Notifications'
import { SimulationGoal, SimulationGoals } from 'Components/SimulationGoals'
import { FromTop } from 'Components/ui/animate'
import Warning from 'Components/ui/WarningBlock'
import { ThemeColorsContext } from 'Components/utils/colors'
import Emoji from 'Components/utils/Emoji'
import useSimulationConfig from 'Components/utils/useSimulationConfig'
import { Body } from 'DesignSystem/typography/paragraphs'
import { useContext } from 'react'
import { Trans } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { SimulationConfig } from 'Reducers/rootReducer'
import { situationSelector } from 'Selectors/simulationSelectors'
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
	const { color } = useContext(ThemeColorsContext)
	ISConfig.color = color
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

function ExerciceDate() {
	const dispatch = useDispatch()
	return (
		<div
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
			<Emoji emoji="📆" />
			&nbsp;
			<Trans i18nKey="impotSociété.exerciceDates">
				Exercice du{' '}
				<RuleInput
					dottedName={'entreprise . exercice . début'}
					showDefaultDateValue
					onChange={(x) =>
						dispatch(updateSituation('entreprise . exercice . début', x))
					}
				/>{' '}
				au{' '}
				<RuleInput
					dottedName={'entreprise . exercice . fin'}
					showDefaultDateValue
					onChange={(x) =>
						dispatch(updateSituation('entreprise . exercice . fin', x))
					}
				/>
			</Trans>
		</div>
	)
}

function Explanations() {
	const situation = useSelector(situationSelector)
	const showResult =
		situation['entreprise . imposition . IS . résultat imposable']
	if (!showResult) {
		return <TrackPage name="accueil" />
	}
	return (
		<FromTop>
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
				<TrackPage name="simulation terminée" />
				<strong>
					<Value
						expression="entreprise . imposition . IS . impôt sur les sociétés"
						displayedUnit="€"
						className="payslip__total"
					/>
				</strong>
				<br />
				<span className="ui__ notice">
					<Trans>Montant de l'impôt sur les sociétés</Trans>
				</span>
			</p>
		</FromTop>
	)
}
