import { Body, HelpButtonWithPopover, Link } from '@/design-system'

export function HelpGuichetUnique() {
	return (
		<HelpButtonWithPopover
			type="info"
			title="Qu'est-ce que le guichet unique ?"
		>
			<Body>
				Le{' '}
				<Link href="https://procedures.inpi.fr/">
					Guichet électronique des formalités d’entreprises
				</Link>{' '}
				(Guichet unique) est un portail internet sécurisé, auprès duquel toute
				entreprise est tenue de déclarer sa création, depuis le 1er janvier
				2023.
			</Body>
			<Body>
				Il utilise une classification des activités différente de celle utilisée
				par l'INSEE pour code APE.
			</Body>
		</HelpButtonWithPopover>
	)
}
