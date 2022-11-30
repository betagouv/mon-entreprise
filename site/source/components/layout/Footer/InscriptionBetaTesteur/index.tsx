import { PopoverWithTrigger } from '@/design-system'
import { Button } from '@/design-system/buttons'
import { Spacing } from '@/design-system/layout'
import { Link } from '@/design-system/typography/link'
import { Body, Intro } from '@/design-system/typography/paragraphs'

import FeedbackSvg from './feedback.svg'

export const INSCRIPTION_LINK =
	'https://b713d5c4.sibforms.com/serve/MUIEACTpgg9LvLVG7P4mkAbGA91OHsC2kuCsR3VlW9bV2m0vliZ31_DvZbtg8R5Lhqzd1Mc1iwuIsBw3FHBDG8Mbr4pjpVSbTzq6SLdox3f41GzWuIsT2IPSZ6x7-wh3ohDNDmHE7wbrenXUnqyPnH8Dm0cP2Hxnrq7T72GzINJR9DWwZd-LsqY2XZrvElFcRz6TlR6l36wGik3X'
export default function InscriptionBetaTesteur() {
	return (
		<PopoverWithTrigger
			trigger={(buttonProps) => (
				<Link {...buttonProps} aria-haspopup="dialog" noUnderline>
					Devenir beta-testeur
				</Link>
			)}
			title="Votre avis nous intéresse"
			small
		>
			<img
				src={FeedbackSvg}
				css={`
					height: auto !important;
					max-width: 25rem;
					padding-top: 2rem;
				`}
				alt=""
			/>
			<Intro>
				Inscrivez-vous pour accéder aux nouveautés en avant-première et donner
				votre avis sur les évolutions du site et des outils mon-entreprise.
			</Intro>
			<Spacing xl />
			<Button size="XL" href={INSCRIPTION_LINK}>
				S'inscrire sur la liste
			</Button>
			<Spacing xl />

			<Body>
				Vous recevrez des informations sur des ateliers de tests utilisateurs,
				des sondages pour donner votre avis, ou encore des liens pour tester de
				nouvelles fonctionnalités.
			</Body>
			<Body>Fréquence : moins d'un email tous les mois</Body>
		</PopoverWithTrigger>
	)
}
