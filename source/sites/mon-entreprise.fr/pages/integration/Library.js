import React from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollToTop } from 'Components/utils/Scroll'
import emoji from 'react-easy-emoji'

export default function Privacy() {
	return (
		<>
			<ScrollToTop />
			<h1>Intégrez notre bibliothèque de calcul</h1>
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
			<h3>1) Faire un calcul très simple : du brut au net</h3>
			<div className="ui__ full-width">
				<iframe
					src="https://codesandbox.io/embed/damp-bird-0m8gl?fontsize=14&hidenavigation=1"
					title="mon-entreprise 1"
					allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb"
					css="width: 80%; margin-left: 10%; height: 600px; border:0; border-radius: 4px; overflow:hidden;"
					sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>
			</div>
			<h3>2) Parcourir la documentation en ligne</h3>
			<p>
				Vous l'aurez constaté dans l'exemple précédent, la recette d'un calcul
				est simple : des variables d'entrée (le salaire brut), une ou plusieurs
				variables de sorties (le salaire net).
			</p>
			<p>
				Toutes ces variables sont listées et expliquées sur notre{' '}
				<a target="_blank" href="/documentation">
					documentation en ligne
				</a>
				.
			</p>

			<p>
				Utilisez le moteur de recherche pour trouver la bonne variable, puis
				cliquez sur "Voir le code source" pour obtenir l'ensemble de la
				documentation : valeur par défaut, valeurs possibles quand c'est une
				énumération de choix, unité quand c'est un nombre, description, question
				utilisateur associée, etc.
			</p>
			<p>
				Lançons un calcul plus proche d'une fiche de paie : voici une
				description de la situation d'entrée annotée de liens vers les pages
				correspondantes de la documentation :
			</p>

			<p css="background: #eee">
				{' '}
				Un{' '}
				<a href="https://mon-entreprise.fr/documentation/contrat-salarié/statut-cadre/choix-statut-cadre">
					cadre
				</a>{' '}
				gagnant{' '}
				<a href="https://mon-entreprise.fr/documentation/contrat-salarié/rémunération/brut-de-base">
					3 400€ bruts
				</a>{' '}
				, qui bénéficie de l'
				<a href="https://mon-entreprise.fr/documentation/contrat-salarié/indemnité-kilométrique-vélo/active">
					indemnité kilométrique vélo
				</a>{' '}
				et qui travaille dans une entreprise de{' '}
				<a href="https://mon-entreprise.fr/documentation/entreprise/effectif">
					12 salariés
				</a>
				.
			</p>
			<p>Voici ce que donne le calcul pour cet exemple plus complet :</p>
			<div className="ui__ full-width">
				<iframe
					src="https://codesandbox.io/embed/mon-entreprise-2-60d6d?fontsize=14&hidenavigation=1"
					title="mon-entreprise 2"
					allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb"
					css="width: 80%; margin-left: 10%; height: 600px; border:0; border-radius: 4px; overflow:hidden;"
					sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>
			</div>
			<h2>(bientôt) Faire des de graphiques économiques</h2>
		</>
	)
}
