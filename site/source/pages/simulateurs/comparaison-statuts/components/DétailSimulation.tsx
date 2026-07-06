import { Trans } from 'react-i18next'

import { EngineDocumentationRoutes } from '@/components/EngineDocumentationRoutes'
import { Condition } from '@/components/EngineValue/Condition'
import { Body, H4, Link, Message } from '@/design-system'
import { useSitePaths } from '@/sitePaths'

import { EngineComparison } from '../EngineComparison'
import { Comparaison } from './Comparaison'

type Props = {
	namedEngines: EngineComparison
}

export const DétailSimulation = ({ namedEngines }: Props) => {
	const { absoluteSitePaths } = useSitePaths()

	return (
		<>
			<Condition expression="entreprise . activité . nature . libérale . réglementée">
				<Message type="info">
					<Trans i18nKey={'pages.simulateurs.comparaison-statuts.warning.PLR'}>
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
				<Comparaison
					namedEngines={namedEngines}
					expandRevenuSection
					withStatusCards
				/>

				<EngineDocumentationRoutes
					basePath={absoluteSitePaths.simulateurs.comparaison}
					namedEngines={namedEngines}
				/>
			</Condition>
		</>
	)
}
