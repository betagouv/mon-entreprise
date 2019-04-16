import { emoji, React } from 'Components'
import { ScrollToTop } from 'Components/utils/Scroll'
import withSitePaths from 'Components/utils/withSitePaths'
import { Link } from 'react-router-dom'
import Animate from 'Ui/animate'
import illustration from './images/multitasking.svg'

export default withSitePaths(function Home({ sitePaths }) {
	return (
		<Animate.fromBottom>
			<ScrollToTop />
			<h1>Déclarer les revenus des plateformes en ligne</h1>
			<img
				css="max-width: 100%; height: 200px; margin: 2rem auto;display:block;"
				src={illustration}
			/>
			<p>
				Vous avez des revenus issus des <strong>plateformes en ligne</strong>{' '}
				(Airbnb, Abritel, Drivy, Blablacar, Leboncoin, etc.), la loi vous oblige
				à les déclarer. Mais il peut être parfois difficile de s'y retrouver
				dans toute la documentation légale {emoji('🤔')}
			</p>
			<p>
				C'est pourquoi nous avons conçu ce guide. En quelques clics, vous saurez
				tout ce qu'il faut faire dans votre situation pour être en règle : ce
				que vous devez déclarer, où, et comment le faire.
			</p>
			<div css="text-align: center">
				<Link
					to={sitePaths.économieCollaborative.activités.index}
					className="ui__ button plain cta">
					Commencer le guide
				</Link>
			</div>
			<p className="ui__ notice">
				PS : cet outils est à but purement informatif, et non coercitif. Nous ne
				stockons absolument aucune donnée utilisateur, tout ce que vous
				saisissez reste sur votre navigateur. Vous pouvez donc répondre aux
				questions suivantes l'esprit léger, en toute transparence {emoji('😌')}
			</p>
		</Animate.fromBottom>
	)
})
