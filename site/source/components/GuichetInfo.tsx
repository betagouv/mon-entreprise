import { useMemo } from 'react'

import { Body, Chip, H5, Li, Message, Strong, Ul } from '@/design-system'
import { usePromise } from '@/hooks/usePromise'
import { capitalise0 } from '@/utils'

type ApeToGuichet = typeof import('@/public/data/ape-to-guichet.json')
type Guichet = typeof import('@/public/data/guichet.json')

export type GuichetEntry = Guichet[keyof Guichet]

export function useGuichetInfo(codeApe?: string): GuichetEntry[] | null {
	const guichet = usePromise(
		async () => (await import('@/public/data/guichet.json'))?.default,
		[]
	)

	const apeToGuichet = usePromise(
		async () => (await import('@/public/data/ape-to-guichet.json'))?.default,
		[]
	)

	return useMemo(() => {
		if (!codeApe || !guichet || !apeToGuichet || !(codeApe in apeToGuichet)) {
			return null
		}

		return apeToGuichet[codeApe as keyof ApeToGuichet].map(
			(code) => guichet[code as keyof Guichet]
		)
	}, [codeApe, guichet, apeToGuichet])
}

export function getGuichetTitle(label: GuichetEntry['label']) {
	return capitalise0(
		[
			(!label.niv3 || label.niv3 === 'Autre') && label.niv2,
			(!label.niv4 || label.niv4 === 'Autre') && label.niv3,
			label.niv4,
		]
			.filter(Boolean)
			.join(' - ')
	)
}

export default function GuichetInfo({ codeApe }: { codeApe: string }) {
	const guichetEntries = useGuichetInfo(codeApe)
	if (!guichetEntries) {
		return null
	}

	return (
		<Ul $noMarker>
			{guichetEntries.map((guichetEntry) => {
				return (
					<Li key={guichetEntry.code}>
						<Message border={false}>
							<H5>
								{getGuichetTitle(guichetEntry.label)}{' '}
								<Chip type="secondary">{guichetEntry.code}</Chip>
							</H5>
							<GuichetDescription {...guichetEntry} />
						</Message>
					</Li>
				)
			})}
		</Ul>
	)
}

export function GuichetDescription({
	caisseDeRetraiteSpéciale,
	typeBénéfice,
	artisteAuteurPossible,
	catégorieActivité,
}: GuichetEntry) {
	return (
		<>
			<Body>
				Activité <Strong>{catégorieActivité.replace(/_/g, ' ')}</Strong> avec le
				type de bénéfice <Strong>{typeBénéfice}</Strong>
				{caisseDeRetraiteSpéciale && (
					<>
						, affiliée à la <Strong>{caisseDeRetraiteSpéciale}</Strong> pour la
						retraite
					</>
				)}
				.
			</Body>
			<Body>
				{artisteAuteurPossible && (
					<>
						Possibilitée d'exercer en tant qu'
						<Strong>ARTISTE AUTEUR</Strong>
					</>
				)}
			</Body>
		</>
	)
}
