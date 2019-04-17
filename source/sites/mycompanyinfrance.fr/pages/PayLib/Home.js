import { emoji, React } from 'Components'
import { ScrollToTop } from 'Components/utils/Scroll'
import withSitePaths from 'Components/utils/withSitePaths'
import { Link } from 'react-router-dom'
import Animate from 'Ui/animate'
import illustration from '../../images/process.svg'

export default withSitePaths(function Home({ sitePaths }) {
	return (
		<Animate.fromBottom>
			<ScrollToTop />
			<h1>Moteur libre de fiches de paie</h1>
			<p>
				Si l'on estime le prix moyen d'un bulletin de paie à 20€ par mois, pour
				les 30 millions de salariés en France, on obtient un coût annuel de plus
				de 5 milliards d'euros. Aujourd'hui, aucune brique n'est mise en commun
				entre les centaines d'acteurs de la paie : logiciels de paie, services
				de paie en ligne, API de paie, service de paie gratuit des URSSAF{' '}
				<a href="https://letese.urssaf.fr">le TESE</a>, etc.
			</p>
			<p>
				Nous lançons en 2019 <strong>une librarie de calcul de paie</strong>,
				basée sur le moteur de calcul du{' '}
				<a href="https://embauche.beta.gouv.fr">simulateur d'embauche</a> qui
				simule aujourd'hui plus de 150 000 situations par moi.
			</p>
			<img
				css="max-width: 100%; height: 200px; margin: 2rem auto;display:block;"
				src={illustration}
			/>
			<p>
				Plusieurs briques minimales sont nécessaires :{' '}
				<ul>
					<li>le calcul </li>
					<li>l'édition du bulletin de paie</li>
					<li>l'explication des calculs</li>
					<li>le fichier DSN.</li>
				</ul>
			</p>

			<p>
				<em>
					[INSERER UNE DEMO ICI] : à gauche on saisit le salaire et on répond à
					des questions; à droite le bulletin de paie généré.{' '}
				</em>
			</p>
			<p>
				Si la paie coûte plusieurs milliards d'euros par an, c'est évidemment
				pour de bonnes raisons : complexité du riche modèle social français;
				prise du droit conventionnel (nombre de conventions et accords
				collectifs et articulation entre elles et le droit du travail);
				intégration avec les outils de RH (gestion des congés, notes de frais,
				etc.).
			</p>
			<p>
				{emoji('➡️ ')}C'est pourquoi nous lançons cette librairie sur le
				périmètre très restreint de la paie du dirigeant de SASU, assimilé au
				régime social des salariés mais non soumis au code du travail et toute
				sa complexité et sauf cas particulier, non soumis à une relation
				conflictuelle avec son patron, lui-même.
			</p>
			<div css="text-align: center">
				<Link to={'#'} className="ui__ button plain cta">
					Ça m'intéresse / je veux participer
				</Link>
			</div>
			<p className="ui__ notice">
				Attention, ceci est une page décrivant un concept pas encore lancé.
			</p>
		</Animate.fromBottom>
	)
})
