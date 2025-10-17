import { useMemo } from 'react'
import { Trans } from 'react-i18next'

import { useRawSituation } from '@/components/utils/EngineContext'
import { Body, Emoji, Intro, Link, Message, Strong } from '@/design-system'
import { AssimiléSalariéContexte } from '@/domaine/AssimiléSalariéContexte'
import { IndépendantContexte } from '@/domaine/IndépendantContexte'
import { AutoEntrepreneurContexteDansPublicodes } from '@/domaine/publicodes/AutoEntrepreneurContexteDansPublicodes'
import { useEngine } from '@/hooks/useEngine'
import { useSitePaths } from '@/sitePaths'

import Comparateur from './components/Comparateur'
import { EngineComparison } from './EngineComparison'

function ComparateurStatutsUI() {
	const engine = useEngine()
	const situation = useRawSituation()
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
		<>
			<Trans i18nKey="comparaisonRégimes.notif">
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
	return <ComparateurStatutsUI />
}
