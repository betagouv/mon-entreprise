import { flow, pipe } from 'effect'
import * as O from 'effect/Option'
import * as R from 'effect/Record'
import { useMemo } from 'react'
import { Trans } from 'react-i18next'
import { useSelector } from 'react-redux'

import { TrackPage } from '@/components/ATInternetTracking'
import { EngineDocumentationRoutes } from '@/components/EngineDocumentationRoutes'
import { StatutType } from '@/components/StatutTag'
import {
	Button,
	Container,
	Grid,
	Intro,
	Spacing,
	Strong,
} from '@/design-system'
import { PublicodesAdapter } from '@/domaine/engine/PublicodesAdapter'
import { useEngine } from '@/hooks/useEngine'
import Détails from '@/pages/simulateurs/comparaison-statuts/components/Détails'
import ModifierOptions from '@/pages/simulateurs/comparaison-statuts/components/ModifierOptions'
import RevenuEstimé from '@/pages/simulateurs/comparaison-statuts/components/RevenuEstimé'
import StatutChoice from '@/pages/simulateurs/comparaison-statuts/components/StatutChoice'
import { EngineComparison } from '@/pages/simulateurs/comparaison-statuts/EngineComparison'
import { useSitePaths } from '@/sitePaths'
import { SituationPublicodes } from '@/store/reducers/rootReducer'
import { completeSituationSelector } from '@/store/selectors/completeSituation.selector'

import { usePreviousStep } from './_components/useSteps'

export default function Comparateur() {
	const namedEngines = useStatutComparaison()
	const { absoluteSitePaths } = useSitePaths()
	const previousStep = usePreviousStep()
	const choixDuStatutPath = absoluteSitePaths.assistants['choix-du-statut']

	return (
		<>
			<TrackPage chapter3="pas_a_pas" name="comparateur" />
			<Trans i18nKey="choix-statut.commune.description">
				<Intro>
					Vous allez maintenant pouvoir entrer dans le détail et comparer{' '}
					<Strong>les revenus</Strong>, la <Strong>couverture sociale</Strong>{' '}
					et la <Strong>gestion comptable et juridique</Strong> avant de faire
					votre choix.
				</Intro>
			</Trans>
			<RevenuEstimé />
			<Spacing xl />
			<Détails namedEngines={namedEngines} />

			<Container
				backgroundColor={(theme) =>
					theme.darkMode
						? theme.colors.extended.dark[700]
						: theme.colors.bases.primary[100]
				}
				style={{
					padding: '2rem 0',
				}}
			>
				<StatutChoice namedEngines={namedEngines} />
				<Spacing xl />
				<Grid container spacing={3}>
					<Grid item xs={12} sm="auto">
						<Button
							light
							color={'secondary'}
							to={choixDuStatutPath[previousStep]}
						>
							{' '}
							<span aria-hidden>←</span> <Trans>Précédent</Trans>
						</Button>
					</Grid>
					<Grid item xs={12} sm="auto">
						<ModifierOptions />
					</Grid>
				</Grid>
			</Container>

			<EngineDocumentationRoutes
				namedEngines={namedEngines}
				basePath={absoluteSitePaths.assistants['choix-du-statut'].comparateur}
			/>
		</>
	)
}

/**
 * Returns the situation for computing the results with the given statut
 * @param statut
 */
function useStatutComparaison(): EngineComparison {
	const possibleStatuts = usePossibleStatuts()
	const situation = useSelector(completeSituationSelector)
	const engine = useEngine()

	const namedEngines = useMemo(
		() =>
			possibleStatuts.map((statut) => ({
				name: statut,
				engine: engine.shallowCopy(),
			})) as EngineComparison,
		[possibleStatuts]
	)

	for (const { name, engine } of namedEngines) {
		engine.setSituation({
			...situation,
			...getSituationFromStatut(name),
		})
	}

	return namedEngines
}

const SASUEIAE: StatutType[] = ['SASU', 'EURL', 'EI', 'AE']
const SASUEURL: StatutType[] = ['SASU', 'EURL']
const SASSARL: StatutType[] = ['SAS', 'SARL']
function usePossibleStatuts(): Array<StatutType> {
	const engine = useEngine()
	// We could do this logic by filtering the applicable status in publicodes,
	// but for now, there is only two options, so we hardcode it
	if (
		engine.evaluate('entreprise . catégorie juridique . EI = non').nodeValue !==
		true
	) {
		return SASUEIAE
	} else if (
		engine.evaluate('entreprise . catégorie juridique . SARL . EURL = non')
			.nodeValue !== true
	) {
		return SASUEURL
	} else {
		return SASSARL
	}
}

function getSituationFromStatut(statut: StatutType): SituationPublicodes {
	return pipe(
		{
			'entreprise . catégorie juridique . remplacements': 'oui',
			'entreprise . catégorie juridique':
				statut === 'SASU'
					? 'SAS'
					: statut === 'EURL'
					? 'SARL'
					: statut === 'AE'
					? 'EI'
					: statut === 'SELARLU'
					? 'SELARL'
					: statut === 'SELASU'
					? 'SELAS'
					: statut,
			'entreprise . catégorie juridique . EI . auto-entrepreneur':
				statut === 'AE' ? 'oui' : 'non',
			'entreprise . associés': ['SARL', 'SAS', 'SELAS', 'SELARL'].includes(
				statut
			)
				? 'multiples'
				: 'unique',
		},
		R.map(flow(O.fromNullable, PublicodesAdapter.encode))
	)
}
