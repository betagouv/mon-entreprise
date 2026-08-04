import { Trans, useTranslation } from 'react-i18next'

import { EngineDocumentationRoutes } from '@/components/EngineDocumentationRoutes'
import { estSituationValide, useComparateur } from '@/contextes/comparateur'
import { Body, H4, Link, Message } from '@/design-system'
import { useSitePaths } from '@/sitePaths'

import { EngineComparison } from '../EngineComparison'
import { Comparaison } from './ComparaisonListe'

export const DétailSimulation = () => {
	const { situation, comparaison } = useComparateur()
	const { t } = useTranslation()
	const { absoluteSitePaths } = useSitePaths()

	if (!estSituationValide(situation)) {
		return (
			<Body>
				{t(
					'pages.simulateurs.comparaison-statuts.détail.aucun',
					'Veuillez renseigner un chiffre d’affaires pour afficher les détails.'
				)}
			</Body>
		)
	}

	const engines = comparaison.map((résultatModèle) => ({
		name: résultatModèle.statut.étiquette,
		engine: résultatModèle.engine(),
	}))

	return situation.activitéLibéraleRéglementée ? (
		<Message type="info">
			<Trans i18nKey={'pages.simulateurs.comparaison-statuts.warning.PLR'}>
				<H4 as="h3">
					Ce simulateur ne prend pas en compte les activités libérales
					réglementées.{' '}
				</H4>
				<Body>
					En effet, ces dernières sont soumises à des règles spécifiques, et ont
					accès à des statuts dédiés : les sociétés d'exercice libérale (SEL).
				</Body>
				<Body>
					<Link href="https://entreprendre.service-public.fr/vosdroits/F23458#fiche-item-aria-2situation2">
						En savoir plus
					</Link>{' '}
				</Body>
			</Trans>
		</Message>
	) : (
		<>
			<Comparaison />

			<EngineDocumentationRoutes
				basePath={absoluteSitePaths.simulateurs.comparaison}
				namedEngines={engines as EngineComparison}
			/>
		</>
	)
}
