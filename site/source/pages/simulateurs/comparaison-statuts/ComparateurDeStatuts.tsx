import { useEffect } from 'react'
import { Trans } from 'react-i18next'

import { Simulateur } from '@/components/Simulateur/Simulateur'
import {
	ComparateurProvider,
	ModèleAssimiléSalarié,
	ModèleAutoEntrepreneur,
	ModèleTravailleurIndépendant,
	simulationEstCommencée,
	useComparateur,
} from '@/contextes/comparateur'
import { Body, Emoji, Intro, Link, Message, Strong } from '@/design-system'
import { usePageMetadata } from '@/hooks/usePageMetadata'
import useSimulationPublicodesÉditorialisées from '@/hooks/useSimulationPublicodesEditorialisee'
import { useSitePaths } from '@/sitePaths'
import { EngineProvider } from '@/utils/publicodes/EngineContext'

import SimulateurPageLayout from '../SimulateurPageLayout'
import { DétailSimulation } from './components/DetailSimulation'
import { comparaisonStatutsMetadata } from './metadata'
import { Objectifs } from './Objectifs'
import { groupesDeQuestions, questionsPrincipales } from './questions'
import { configComparateurStatuts } from './simulationConfig'

export const ComparateurDeStatuts = () => (
	<ComparateurProvider
		modèles={[
			ModèleAssimiléSalarié,
			ModèleTravailleurIndépendant,
			ModèleAutoEntrepreneur,
		]}
	>
		<PageComparateur />
	</ComparateurProvider>
)

const PageComparateur = () => {
	const metadata = usePageMetadata(comparaisonStatutsMetadata)
	const {
		isReady,
		engine,
		// questionsPrincipales,
		// groupesDeQuestions,
		// simulationEstCommencée,
		//  onReset,
	} = useSimulationPublicodesÉditorialisées(metadata, configComparateurStatuts)

	const { absoluteSitePaths } = useSitePaths()

	const { situation, set } = useComparateur()

	useEffect(() => {
		set.reset()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<EngineProvider value={engine}>
			<SimulateurPageLayout
				metadata={metadata}
				showDate={false}
				isReady={isReady}
			>
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
					metadata={metadata}
					montantsÀSaisir={<Objectifs />}
					questionsFourniesPrincipales={questionsPrincipales}
					groupesDeQuestionsFournies={groupesDeQuestions}
					situation={situation}
					simulationEstCommencée={simulationEstCommencée(situation)}
					// montantsÀSaisir={<MontantsÀSaisir />}
					// questionsPublicodesPrincipales={questionsPrincipales}
					// groupesDeQuestionsPublicodes={groupesDeQuestions}
					détail={<DétailSimulation />}
					onReset={set.reset}
				/>
			</SimulateurPageLayout>
		</EngineProvider>
	)
}
