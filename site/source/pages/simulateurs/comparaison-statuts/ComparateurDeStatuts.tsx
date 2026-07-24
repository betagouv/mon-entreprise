import { useMemo } from 'react'
import { Trans } from 'react-i18next'
import { useSelector } from 'react-redux'

import { Simulateur } from '@/components/Simulateur/Simulateur'
import { Body, Emoji, Intro, Link, Message, Strong } from '@/design-system'
import { AssimiléSalariéContexte } from '@/domaine/AssimiléSalariéContexte'
import { IndépendantContexte } from '@/domaine/IndépendantContexte'
import { AutoEntrepreneurContexteDansPublicodes } from '@/domaine/publicodes/AutoEntrepreneurContexteDansPublicodes'
import { usePageMetadata } from '@/hooks/usePageMetadata'
import useSimulationPublicodesÉditorialisées from '@/hooks/useSimulationPublicodesEditorialisee'
import { useSitePaths } from '@/sitePaths'
import { completeSituationSelector } from '@/store/selectors/completeSituation.selector'
import { EngineProvider } from '@/utils/publicodes/EngineContext'

import SimulateurPageLayout from '../SimulateurPageLayout'
import { DétailSimulation } from './components/DétailSimulation'
import { MontantsÀSaisir } from './components/MontantsASaisir'
import { EngineComparison } from './EngineComparison'
import { comparaisonStatutsMetadata } from './metadata'
import { configComparateurStatuts } from './simulationConfig'

export const ComparateurDeStatuts = () => {
	const metadata = usePageMetadata(comparaisonStatutsMetadata)
	const {
		isReady,
		engine,
		questionsPrincipales,
		groupesDeQuestions,
		simulationEstCommencée,
		onReset,
	} = useSimulationPublicodesÉditorialisées(metadata, configComparateurStatuts)

	const situation = useSelector(completeSituationSelector)
	const { absoluteSitePaths } = useSitePaths()

	const assimiléEngine = useMemo(
		() =>
			engine.shallowCopy().setSituation({
				...situation,
				...AssimiléSalariéContexte,
			}),
		[situation, engine]
	)
	const autoEntrepreneurEngine = useMemo(
		() =>
			engine.shallowCopy().setSituation({
				...situation,
				...AutoEntrepreneurContexteDansPublicodes,
			}),
		[situation, engine]
	)

	const indépendantEngine = useMemo(
		() =>
			engine.shallowCopy().setSituation({
				...situation,
				...IndépendantContexte,
			}),
		[situation, engine]
	)

	const engines = [
		{ engine: assimiléEngine, name: 'SASU' },
		{ engine: indépendantEngine, name: 'EI' },
		{ engine: autoEntrepreneurEngine, name: 'AE' },
	] as EngineComparison

	return (
		<EngineProvider value={engine}>
			<SimulateurPageLayout metadata={metadata} isReady={isReady}>
				<Trans i18nKey="pages.simulateurs.comparaison-statuts.notif">
					<Message type="secondary" icon={<Emoji emoji="✨" />} border={false}>
						<Body>
							Découvrez quel statut est le{' '}
							<Strong>plus adapté pour votre activité</Strong> grâce au{' '}
							<Link to={absoluteSitePaths.assistants['choix-du-statut'].index}>
								nouvel assistant au choix du statut
							</Link>{' '}
							!
						</Body>
					</Message>
				</Trans>
				<Intro>
					<Trans i18nKey="pages.simulateurs.comparaison-statuts.description">
						Lorsque vous créez votre entreprise, le choix du statut juridique va{' '}
						<Strong>
							déterminer à quel régime social le dirigeant est affilié
						</Strong>
						. Il en existe <Strong>trois différents</Strong>, avec chacun ses
						avantages et inconvénients. Avec ce comparatif, trouvez celui qui
						vous correspond le mieux.
					</Trans>
				</Intro>

				<Simulateur
					id={metadata.id}
					beta={metadata.beta}
					montantsÀSaisir={<MontantsÀSaisir />}
					questionsPublicodesPrincipales={questionsPrincipales}
					groupesDeQuestionsPublicodes={groupesDeQuestions}
					détail={<DétailSimulation namedEngines={engines} />}
					simulationEstCommencée={simulationEstCommencée}
					onReset={onReset}
				/>
			</SimulateurPageLayout>
		</EngineProvider>
	)
}
