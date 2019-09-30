import React from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollToTop } from 'Components/utils/Scroll'
import emoji from 'react-easy-emoji'

export default function Privacy() {
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
			<h2>Comment l'utiliser ?</h2>
			<p>
				Les exemples suivants vous montrent comment utiliser la librairie sur un
				site ReactJs très simple.
			</p>
			<h3>1) Exemple très simple de calcul brut -> net</h3>
			<iframe
				src="https://codesandbox.io/embed/damp-bird-0m8gl?fontsize=14&hidenavigation=1"
				title="mon-entreprise 1"
				allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb"
				css="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
				sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>
			<h2>(à venir) Démo de paie plus complète</h2>
			<h2>(à venir) Démo de graphique économico-journalistique</h2>
		</>
	)
}
