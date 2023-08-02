import { Message } from '@/design-system'
import { H3 } from '@/design-system/typography/heading'
import { Intro } from '@/design-system/typography/paragraphs'

import { GuichetEntry } from '../../recherche-code-ape/GuichetInfo'

export function estNonDisponible(guichet: GuichetEntry): boolean {
	return (
		!!guichet.caisseDeRetraiteSpéciale ||
		guichet.artisteAuteurPossible ||
		guichet.affiliationPrincipale === 'MSA' ||
		guichet.catégorieActivité === 'AGENT_COMMERCIAL' ||
		guichet.catégorieActivité === 'GESTION_DE_BIENS'
	)
}

export function AvertissementActivitéNonDisponible({
	guichet,
}: {
	guichet: GuichetEntry | undefined
}) {
	if (!guichet || !estNonDisponible(guichet)) {
		return null
	}

	return (
		<>
			<Message type="info">
				<H3>
					Cet assistant ne propose pas encore d'aide pour les{' '}
					{guichet.artisteAuteurPossible ? (
						<>artistes-auteurs</>
					) : guichet.caisseDeRetraiteSpéciale ? (
						<>professions libérales réglementées</>
					) : guichet.affiliationPrincipale === 'MSA' ? (
						<>entreprises agricoles</>
					) : guichet.catégorieActivité === 'AGENT_COMMERCIAL' ? (
						<>agents commerciaux</>
					) : (
						<>locations de biens</>
					)}
				</H3>
				<Intro>
					Pour plus d'informations relatives à votre situation, vous pouvez
					consulter les sites entreprendre.service-public.fr, urssaf.fr et
					bpifrance-création.fr
				</Intro>
			</Message>
		</>
	)
}
