import React, { useEffect } from 'react'
import '../mon-entreprise.fr/App.css'
import 'Ui/index.css'
import ColoredYaml from 'Components/rule/ColoredYaml'
import exemple1 from '!!raw-loader!./exemple1.yaml'
import exemple2 from '!!raw-loader!./exemple2.yaml'

let Landing = () => {
	useEffect(() => {
		var css = document.createElement('style')
		css.type = 'text/css'
		css.innerHTML = `
		#js {
			animation: appear 0.5s;
			opacity: 1;
		}
		#loading {
			display: none !important;
		}`
		document.body.appendChild(css)
	})
	return (
		<div className="app-container">
			<div className="app-content ui__ container">
				<div css="text-align: center">
					<h1 css="">
						<span css="border: 3px solid var(--colour); color: var(--colour); padding: 0.1rem 0.4rem 0.1rem 0.6rem ; width: 5rem">
							publi
						</span>
						<span css="background: var(--colour); color: white; padding: 0.1rem 0.6rem 0.1rem 0.4rem; width: 5rem; border: 3px solid var(--colour)">
							codes
						</span>
					</h1>
					<p css="width: 28rem; margin: 0 auto; font-size: 120%">
						Un nouveau langage de calcul pour encoder les algorithmes d'intérêt
						public.
					</p>
				</div>
				<h2>Pourquoi ?</h2>
				<p>
					Certains algorithmes sont bien trop importants pour être maintenus
					dans une boîte noire, souvent privée, que seuls les développeurs
					expérimentés peuvent comprendre.
				</p>
				<p>
					{' '}
					C'est notamment le cas d'une bonne partie de la loi, qui spécifie en
					français des règles... et charge à d'autres de les implémenter
					librement.
				</p>
				<p>
					La plateforme publicodes fusionne documentation et implémentation en
					partant d'un code simple. Ajouter une règle de calcul, c'est déployer
					sans effort sur le Web la page de documentation correspondante,
					lisible par tout citoyen.
				</p>
				<h2>Projets phares</h2>
				<h3>
					La sécurité sociale et les impôts -{' '}
					<a href="https://mon-entreprise.fr">mon-entreprise.fr</a>
				</h3>
				<ColoredYaml source={exemple1} />

				<h3>
					L'impact climatique de nos gestes du quotidien - &nbsp;
					<a href="https://futur.eco">futur.eco</a>
				</h3>
				<ColoredYaml source={exemple2} />
			</div>
		</div>
	)
}

let ExportedApp = Landing

// Remove loader

if (process.env.NODE_ENV !== 'production') {
	const { hot } = require('react-hot-loader')
	ExportedApp = hot(module)(Landing)
}

export default ExportedApp
