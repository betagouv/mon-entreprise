import Engine from 'publicodes'
import { useTranslation } from 'react-i18next'

import { DottedName } from '@/../../modele-social'
import { EngineDocumentationRoutes } from '@/components/EngineDocumentationRoutes'
import PeriodSwitch from '@/components/PeriodSwitch'
import Simulation, {
	SimulationGoal,
	SimulationGoals,
} from '@/components/Simulation'
import { Statut } from '@/components/StatutTag'
import { Spacing } from '@/design-system/layout'
import { useSitePaths } from '@/sitePaths'

import Détails from './Détails'
import Résultats from './Résultats'

type NamedEngine = {
	engine: Engine<DottedName>
	name: Statut
}

export type EngineComparison =
	| [NamedEngine, NamedEngine, NamedEngine]
	| [NamedEngine, NamedEngine]

function Comparateur({ namedEngines }: { namedEngines: EngineComparison }) {
	const { t } = useTranslation()

	const engines = namedEngines.map(({ engine }) => engine) as [
		Engine<DottedName>,
		Engine<DottedName>,
		Engine<DottedName>
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
			<Spacing md />
			<Résultats namedEngines={namedEngines} />
			<Détails namedEngines={namedEngines} />
			<EngineDocumentationRoutes
				basePath={absoluteSitePaths.simulateurs.comparaison}
				namedEngines={namedEngines}
			/>
		</>
	)
}

export default Comparateur
