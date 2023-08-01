import Engine from 'publicodes'
import { useTranslation } from 'react-i18next'

import { DottedName } from '@/../../modele-social'
import { EngineDocumentationRoutes } from '@/components/EngineDocumentationRoutes'
import PeriodSwitch from '@/components/PeriodSwitch'
import Simulation, {
	SimulationGoal,
	SimulationGoals,
} from '@/components/Simulation'
import { StatutType } from '@/components/StatutTag'
import { Container, Spacing } from '@/design-system/layout'
import { useSitePaths } from '@/sitePaths'

import Détails from './Détails'
import ModifierOptions from './ModifierOptions'
import StatutChoice from './StatutChoice'

type NamedEngine = {
	engine: Engine<DottedName>
	name: StatutType
}

export type EngineComparison =
	| [NamedEngine, NamedEngine, NamedEngine]
	| [NamedEngine, NamedEngine]

function Comparateur({ namedEngines }: { namedEngines: EngineComparison }) {
	const { t } = useTranslation()

	const engines = namedEngines.map(({ engine }) => engine) as [
		Engine<DottedName>,
		Engine<DottedName>,
		Engine<DottedName>,
	]

	const { absoluteSitePaths } = useSitePaths()

	return (
		<>
			<Simulation
				engines={engines}
				hideDetails
				showQuestionsFromBeginning
				fullWidth
				id="simulation-comparateur"
			>
				<SimulationGoals
					toggles={<PeriodSwitch />}
					legend={'Estimations sur votre rémunération brute et vos charges'}
				>
					<SimulationGoal
						dottedName="entreprise . chiffre d'affaires"
						isInfoMode
						label={t("Chiffre d'affaires estimé")}
					/>
					<SimulationGoal dottedName="entreprise . charges" isInfoMode />
				</SimulationGoals>
			</Simulation>
			<Spacing lg />
			<Container
				backgroundColor={(theme) =>
					theme.darkMode
						? theme.colors.extended.dark[700]
						: theme.colors.bases.primary[100]
				}
				css={`
					padding: 1rem 0;
				`}
			>
				<StatutChoice namedEngines={namedEngines} hideCTA />
				<div
					css={`
						text-align: right;
						padding-top: 1rem;
					`}
				>
					<ModifierOptions namedEngines={namedEngines} />
				</div>
			</Container>
			<Détails namedEngines={namedEngines} />
			<EngineDocumentationRoutes
				namedEngines={namedEngines}
				basePath={absoluteSitePaths.assistants['choix-du-statut'].comparateur}
			/>
			<EngineDocumentationRoutes
				basePath={absoluteSitePaths.simulateurs.comparaison}
				namedEngines={namedEngines}
			/>
		</>
	)
}

export default Comparateur
