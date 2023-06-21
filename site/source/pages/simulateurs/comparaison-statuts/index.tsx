import { useMemo } from 'react'
import { Trans } from 'react-i18next'

import { useEngine, useRawSituation } from '@/components/utils/EngineContext'
import { Strong } from '@/design-system/typography'
import { Intro } from '@/design-system/typography/paragraphs'

import Comparateur, { EngineComparison } from './components/Comparateur'
import {
	CasParticuliersProvider,
	useCasParticuliers,
} from './contexts/CasParticuliers'

function ComparateurStatutsUI() {
	const engine = useEngine()
	const situation = useRawSituation()

	const { isAutoEntrepreneurACREEnabled } = useCasParticuliers()

	const assimiléEngine = useMemo(
		() =>
			engine.shallowCopy().setSituation({
				...situation,
				'entreprise . imposition': "'IS'",
				'entreprise . catégorie juridique': "'SAS'",
				'entreprise . associés': "'unique'",
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
		{ engine: assimiléEngine, name: 'SASU' },
		{ engine: indépendantEngine, name: 'EI' },
		{ engine: autoEntrepreneurEngine, name: 'AE' },
	] as EngineComparison

	return (
		<>
			<Intro>
				<Trans i18nKey="comparaisonRégimes.description">
					Lorsque vous créez votre entreprise, le choix du statut juridique va{' '}
					<Strong>
						déterminer à quel régime social le dirigeant est affilié
					</Strong>
					. Il en existe <Strong>trois différents</Strong>, avec chacun ses
					avantages et inconvénients. Avec ce comparatif, trouvez celui qui vous
					correspond le mieux.
				</Trans>
			</Intro>
			<Comparateur namedEngines={engines} />
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
