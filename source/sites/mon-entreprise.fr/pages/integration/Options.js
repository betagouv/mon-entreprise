import { React, T } from 'Components'
import { Link } from 'react-router-dom'
import emoji from 'react-easy-emoji'
import withSitePaths from 'Components/utils/withSitePaths'
import illustration from './illustration.png'

export default withSitePaths(({ sitePaths }) => (
	<section id="integration">
		<div>
			<h1 css="margin-bottom: 0">
				Intégrez le droit de la sécurité sociale au coeur de vos outils
			</h1>
			<div css="text-align: center; ">
				<img css="height: 250px" src={illustration} />
			</div>
			<p>
				En plus du site mon-entreprise.fr, nous développons des outils gratuits
				et libres à intégrer directement chez vous, dans les parcours habituels
				de vos utilisateurs.
			</p>
			<Link className="ui__ button-choice" to={sitePaths.integration.iframe}>
				{emoji('📱')} <T>Intégrer l'interface de simulation</T>
			</Link>
			<p>Intégrer l'un de nos simulateurs en un clic dans votre site Web.</p>
			<br />
			<Link className="ui__ button-choice " to={sitePaths.integration.library}>
				{emoji('🧰')} <T>Intégrer la bibliothèque de calcul</T>
			</Link>
			<p css="margin-top: -1em">
				Intégrer les calculs sans l'interface dans votre site Web ou sur votre
				serveur, via une bibliothèque NPM.
			</p>
		</div>
	</section>
))
