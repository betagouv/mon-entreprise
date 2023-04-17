import { Chip, Message } from '@/design-system'
import { Strong } from '@/design-system/typography'
import { H5 } from '@/design-system/typography/heading'
import { Li, Ul } from '@/design-system/typography/list'
import { Body } from '@/design-system/typography/paragraphs'
import { useAsyncData } from '@/hooks/useAsyncData'

const lazyApeToGuichet = () => import('@/public/data/ape-to-guichet.json')
type ApeToGuichet = typeof import('@/public/data/ape-to-guichet.json')
const lazyGuichet = () => import('@/public/data/guichet.json')
type Guichet = typeof import('@/public/data/guichet.json')

export default function GuichetInfo({ apeCode }: { apeCode: string }) {
	const guichet = useAsyncData(lazyGuichet)?.default
	const apeToGuichet = useAsyncData(lazyApeToGuichet)?.default

	if (!guichet || !apeToGuichet || !(apeCode in apeToGuichet)) {
		return null
	}
	const guichetEntries = apeToGuichet[apeCode as keyof ApeToGuichet].map(
		(code) => guichet[code as keyof Guichet]
	)

	return (
		<Ul noMarker>
			{guichetEntries.map(
				({
					label,
					caisseDeRetraiteSpéciale,
					typeBénéfice,
					artisteAuteurPossible,
					catégorieActivité,
					code,
				}) => {
					return (
						<Li key={code}>
							<Message border={false}>
								<H5>
									{label.niv4
										? label.niv4
										: label.niv3
										? label.niv3
										: label.niv2}
									<Chip type="secondary">{code}</Chip>
								</H5>
								<Body>
									Activité{' '}
									<Strong>{catégorieActivité.replace(/_/g, ' ')}</Strong> avec
									des revenus déclarés en <Strong>{typeBénéfice}</Strong>{' '}
									{caisseDeRetraiteSpéciale && (
										<>
											, affiliée à la{' '}
											<Strong>{caisseDeRetraiteSpéciale}</Strong> pour la
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

								{/* </Ul> */}
							</Message>
						</Li>
					)
				}
			)}
		</Ul>
	)
}
