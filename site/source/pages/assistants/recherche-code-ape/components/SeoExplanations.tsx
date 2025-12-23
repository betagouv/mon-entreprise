import { Trans } from 'react-i18next'

import { Body, H2, Link } from '@/design-system'

export const SeoExplanations = () => (
	<Trans i18nKey="pages.assistant.recherche-code-ape.seo explanation">
		<H2>Comment fonctionne la recherche de code APE ?</H2>
		<Body>
			Pour retrouver le code APE de votre entreprise, saisissez un ou deux
			mots-clés qui décrivent l'activité exercée. Par exemple : « restauration »
			ou « coach sportif » La recherche utilise les bases de l'Insee et du
			Guichet Unique pour trouver les activités qui correspondent. Par ailleurs,
			les résultats les plus populaires (avec le plus d'entreprise crées) sont
			affichés en premier.
		</Body>
		<Body>
			Si vous ne retrouvez pas le code APE correspondant à votre activité, vous
			pouvez nous le signaler avec le bouton « Je ne trouve pas mon activité ».
			Cela nous permettra d'améliorer la recherche en ajoutant des mots clés au
			fur et à mesure de vos retours.
		</Body>

		<H2>Source</H2>
		<Body>
			Les données utilisées pour ce moteur de recherche sont extraites du PDF
			des nomenclatures d'activités françaises de l'INSEE, qui est disponible
			sur{' '}
			<Link href="https://www.insee.fr/fr/information/2120875">cette page</Link>
			.
		</Body>
	</Trans>
)
