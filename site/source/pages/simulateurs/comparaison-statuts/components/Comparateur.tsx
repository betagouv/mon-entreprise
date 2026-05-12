import PeriodSwitch from '@/components/PeriodSwitch'
import Simulation, { SimulationGoals } from '@/components/Simulation'
import { Spacing } from '@/design-system'
import { ComparateurDeModèles } from '@/domaine/comparateur/ComparateurDeModèle'
import { ModèleAssimiléSalarié } from '@/domaine/comparateur/ModèleAssimiléSalarié'
import { ModèleAutoEntrepreneur } from '@/domaine/comparateur/ModèleAutoEntrepreneur'
import { ModèleComparable } from '@/domaine/comparateur/ModèleComparable'
import { ModèleTravailleurIndépendant } from '@/domaine/comparateur/ModèleTravailleurIndépendant'

import { Objectifs } from '../Objectifs'
import Détails from './Détails'

const modèles: ModèleComparable[] = [
	ModèleAutoEntrepreneur,
	ModèleAssimiléSalarié,
	ModèleTravailleurIndépendant,
]

export default function Comparateur() {
	// const simulateurConfig = useSimulatorData('comparaison-statuts')
	// const { questions, raccourcis } = useSimulationPublicodes(simulateurConfig)
	// const { t } = useTranslation()

	// const { absoluteSitePaths } = useSitePaths()

	const comparateur = ComparateurDeModèles(modèles)

	return (
		<>
			<Simulation
				hideDetails
				showQuestionsFromBeginning
				// questionsPublicodes={questions}
				// raccourcisPublicodes={raccourcis}
				fullWidth
				id="simulation-comparateur"
			>
				<SimulationGoals>
					<PeriodSwitch />
					<Objectifs comparateur={comparateur} />
				</SimulationGoals>
			</Simulation>

			<Spacing lg />

			{/* <Détails namedEngines={namedEngines} expandRevenuSection /> */}

			{/* <Condition expression="entreprise . activité . nature . libérale . réglementée">
				<Message type="info">
					<Trans i18nKey={'comparaisonRégimes.warning-libéral-reglementé'}>
						<H4 as="h3">
							Ce simulateur ne prend pas en compte les activités libérales
							réglementées.{' '}
						</H4>
						<Body>
							En effet, ces dernières sont soumises à des règles spécifiques, et
							ont accès à des statuts dédiés : les sociétés d'exercice libérale
							(SEL).
						</Body>
						<Body>
							<Link href="https://entreprendre.service-public.fr/vosdroits/F23458#fiche-item-aria-2situation2">
								En savoir plus
							</Link>{' '}
						</Body>
					</Trans>
				</Message>
			</Condition>

			<Condition expression="entreprise . activité . nature . libérale . réglementée = non">
				<ConteneurBleu>
					<StatutChoice namedEngines={namedEngines} hideCTA />
					<div
						style={{
							textAlign: 'right',
							paddingTop: '1rem',
						}}
					>
						<ModifierOptions />
					</div>
				</ConteneurBleu>
				<Détails namedEngines={namedEngines} expandRevenuSection />

				<EngineDocumentationRoutes
					basePath={absoluteSitePaths.simulateurs.comparaison}
					namedEngines={namedEngines}
				/>
			</Condition> */}
		</>
	)
}
