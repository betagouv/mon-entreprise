import { Trans, useTranslation } from 'react-i18next'

import { EngineDocumentationRoutes } from '@/components/EngineDocumentationRoutes'
import { Condition } from '@/components/EngineValue/Condition'
import PeriodSwitch from '@/components/PeriodSwitch'
import Simulation, {
	SimulationGoal,
	SimulationGoals,
} from '@/components/Simulation'
import { Body, Container, H4, Link, Message, Spacing } from '@/design-system'
import { EngineComparison } from '@/pages/simulateurs/comparaison-statuts/EngineComparison'
import { useSitePaths } from '@/sitePaths'

import Détails from './Détails'
import ModifierOptions from './ModifierOptions'
import StatutChoice from './StatutChoice'

function Comparateur({ namedEngines }: { namedEngines: EngineComparison }) {
	const { t } = useTranslation()

	const { absoluteSitePaths } = useSitePaths()

	return (
		<>
			<Simulation
				hideDetails
				showQuestionsFromBeginning
				fullWidth
				id="simulation-comparateur"
			>
				<SimulationGoals>
					<PeriodSwitch />
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
						<ModifierOptions />
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
