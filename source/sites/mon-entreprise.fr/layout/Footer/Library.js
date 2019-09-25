import { T } from 'Components'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollToTop } from 'Components/utils/Scroll'
import emoji from 'react-easy-emoji'

export default function Privacy() {
	const { i18n } = useTranslation()
	return (
		<>
			<ScrollToTop />
			<h1>Bibliothèque de calcul</h1>
			<p>
				Si vous pensez que votre site ou service gagnerait à afficher des
				calculs de salaire, par exemple passer du salaire brut au salaire net,
				bonne nouvelle : tous les calculs de cotisations et impôts qui sont
				derrière mon-entreprise.fr sont libres et{' '}
				<b>
					intégrables sous forme d'une{' '}
					<a href="https://www.npmjs.com/package/mon-entreprise">
						librairie NPM
					</a>
				</b>
				.
			</p>
			<p>
				Dit plus simplement, les développeurs de votre équipe sont en mesure
				d'intégrer le calcul dans votre interface en 5 minutes
				{emoji('⌚')}, sans avoir à gérer la complexité de la paie et la mise à
				jour régulière des règles de calcul.
			</p>

			<p>
				Cette bibliothèque est un commun numérique développé par l'Etat et
				l'ACOSS.
			</p>
			A venir : 
			<h2>Démo très simple brut -> net</h2>
			<h2>Démo de paie plus complète</h2>
			<h2>Démo de graphique économico-journalistique</h2>
		</>
	)
}
