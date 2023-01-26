import { DottedName } from 'modele-social'
import Engine from 'publicodes'
import { useMemo } from 'react'
import { Trans } from 'react-i18next'

import { useEngine, useRawSituation } from '@/components/utils/EngineContext'
import useSimulationConfig from '@/components/utils/useSimulationConfig'
import { Strong } from '@/design-system/typography'
import { Intro } from '@/design-system/typography/paragraphs'
import { useSitePaths } from '@/sitePaths'

import { configComparateurStatuts } from '../configs/comparateurStatuts'
import Comparateur from './components/Comparateur'
import {
	CasParticuliersProvider,
	useCasParticuliers,
} from './contexts/CasParticuliers'

function ComparateurStatutsUI() {
	const engine = useEngine()
	const situation = useRawSituation()

	const { isAutoEntrepreneurACREEnabled } = useCasParticuliers()

	const { absoluteSitePaths } = useSitePaths()
	useSimulationConfig({
		path: absoluteSitePaths.simulateurs.comparaison,
		config: configComparateurStatuts,
	})

	const assimiléEngine = useMemo(
		() =>
			engine.shallowCopy().setSituation({
				...situation,
				'entreprise . imposition': "'IS'",
				'entreprise . catégorie juridique': "'SAS'",
				'entreprise . catégorie juridique . SAS . unipersonnelle': 'oui',
			}),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[situation]
	)
	const autoEntrepreneurEngine = useMemo(
		() =>
			engine.shallowCopy().setSituation({
				...situation,
				'entreprise . catégorie juridique': "'EI'",
				'entreprise . catégorie juridique . EI . auto-entrepreneur': 'oui',
				...(isAutoEntrepreneurACREEnabled
					? { 'dirigeant . exonérations . ACRE': 'oui' }
					: { 'dirigeant . exonérations . ACRE': 'non' }),
			}),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[situation, isAutoEntrepreneurACREEnabled]
	)

	const indépendantEngine = useMemo(
		() =>
			engine.shallowCopy().setSituation({
				...situation,
				'entreprise . imposition':
					situation['entreprise . imposition'] ?? "'IS'",
				'entreprise . catégorie juridique': "'EI'",
				'entreprise . catégorie juridique . EI . auto-entrepreneur': 'non',
			}),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[situation]
	)

	const engines = [
		assimiléEngine,
		autoEntrepreneurEngine,
		indépendantEngine,
	] as [Engine<DottedName>, Engine<DottedName>, Engine<DottedName>]

	return (
		<>
			<Intro>
				<Trans i18nKey="comparaisonRégimes.description">
					Lorsque vous créez votre société, le choix du statut juridique va{' '}
					<Strong>
						déterminer à quel régime social le dirigeant est affilié
					</Strong>
					. Il en existe <Strong>trois différents</Strong>, avec chacun ses
					avantages et inconvénients. Avec ce comparatif, trouvez celui qui vous
					correspond le mieux.
				</Trans>
			</Intro>
			<Comparateur engines={engines} />
		</>
	)
}

export default function ComparateurStatuts() {
	return (
		<CasParticuliersProvider>
			<ComparateurStatutsUI />
		</CasParticuliersProvider>
	)
}
