import { useTranslation } from 'react-i18next'

import donnerVotreAvisSvg from '@/assets/images/donner-votre-avis-services-publics.svg'
import { Link } from '@/design-system'

export const JeDonneMonAvis = ({ light }: { light?: boolean }) => {
	const { t } = useTranslation()
	const href =
		'https://jedonnemonavis.numerique.gouv.fr/Demarches/3226?&view-mode=formulaire-avis&nd_mode=en-ligne-enti%C3%A8rement&nd_source=button&key=e62c98db43a483b98032a17ddcc8d279'

	return (
		<Link
			href={href}
			aria-label={t(
				'Je donne mon avis, donner mon avis sur jedonnemonavis.numerique.gouv.fr, nouvelle fenêtre'
			)}
		>
			<img
				src={
					light
						? donnerVotreAvisSvg
						: 'https://jedonnemonavis.numerique.gouv.fr/static/bouton-blanc.svg'
				}
				alt=""
			/>
		</Link>
	)
}
