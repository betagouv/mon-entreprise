import exemple1 from '!!raw-loader!./exemples/bareme-ir.yaml'
import exemple2 from '!!raw-loader!./exemples/douche.yaml'
import ColoredYaml from 'Components/rule/ColoredYaml'
import React, { useEffect } from 'react'
import emoji from 'react-easy-emoji'
import { Link } from 'react-router-dom'
import { Header } from './Header'

export default function Landing() {
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
		<div className="app-content ui__ container" css="margin-bottom: 2rem">
			<Header />
			<h2>Pourquoi ?</h2>
			<p>
				Certains algorithmes sont bien trop importants pour être maintenus dans
				une boîte noire, souvent privée, que seuls les développeurs expérimentés
				peuvent comprendre.
			</p>
			<p>
				{' '}
				C'est notamment le cas d'une bonne partie de la loi, qui spécifie en
				français des règles... et charge à d'autres de les implémenter
				librement.
			</p>
			<p>
				La plateforme <em>publicodes</em> fusionne documentation et
				implémentation en partant d'un code simple. Ajouter une règle de calcul,
				c'est déployer sans effort sur le Web la page de documentation
				correspondante, lisible par tout citoyen.
			</p>
			<br />
			<p>Pour aller plus loin:</p>
			<ul>
				<li>
					<a href="https://github.com/betagouv/publicodes/wiki">
						{emoji('📖 ')} Lisez la documentation
					</a>
				</li>
				<li>
					<Link to="/studio">⚡ Essayez le langage </Link>
				</li>
			</ul>
			<h2>Projets phares</h2>
			<h3>
				La sécurité sociale et les impôts -{' '}
				<a href="https://mon-entreprise.fr">mon-entreprise.fr</a>
			</h3>
			<div className="ui__ card">
				<ColoredYaml source={exemple1} />
			</div>
			<Link to="/studio?exemple=bareme-ir" className="ui__ button small">
				Lancer le calcul ⚡
			</Link>
			<p>
				En plus du site Web, Mon-entreprise est disponible comme une{' '}
				<a href="https://mon-entreprise.fr/intégration/bibliothèque-de-calcul">
					bibliothèque de calcul autonome
				</a>
				.
			</p>
			<h3>
				L'impact climatique de nos gestes du quotidien - &nbsp;
				<a href="https://futur.eco">futur.eco</a>
			</h3>
			<div className="ui__ card">
				<ColoredYaml source={exemple2} />
			</div>
			<Link to="/studio?exemple=douche" className="ui__ button small">
				Lancer le calcul ⚡
			</Link>
			<br />
		</div>
	)
}
