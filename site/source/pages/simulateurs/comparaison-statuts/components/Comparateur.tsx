import { DottedName } from 'modele-social'
import Engine from 'publicodes'
import { Trans, useTranslation } from 'react-i18next'

import { EngineDocumentationRoutes } from '@/components/EngineDocumentationRoutes'
import { Condition } from '@/components/EngineValue/Condition'
import PeriodSwitch from '@/components/PeriodSwitch'
import Simulation, {
	SimulationGoal,
	SimulationGoals,
} from '@/components/Simulation'
import { StatutType } from '@/components/StatutTag'
import { Message } from '@/design-system'
import { Container, Spacing } from '@/design-system/layout'
import { H4 } from '@/design-system/typography/heading'
import { Link } from '@/design-system/typography/link'
import { Body } from '@/design-system/typography/paragraphs'
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

			<Condition expression="entreprise . activité . nature . libérale . réglementée">
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
				<Container
					backgroundColor={(theme) =>
						theme.darkMode
							? theme.colors.extended.dark[700]
							: theme.colors.bases.primary[100]
					}
					style={{
						padding: '1rem 0',
					}}
				>
					<StatutChoice namedEngines={namedEngines} hideCTA />
					<div
						style={{
							textAlign: 'right',
							paddingTop: '1rem',
						}}
					>
						<ModifierOptions namedEngines={namedEngines} />
					</div>
				</Container>
				<Détails namedEngines={namedEngines} expandRevenuSection />
				<EngineDocumentationRoutes
					basePath={absoluteSitePaths.simulateurs.comparaison}
					namedEngines={namedEngines}
				/>
			</Condition>
		</>
	)
}

export default Comparateur
