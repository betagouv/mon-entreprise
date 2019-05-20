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
				(Airbnb, Abritel, Drivy, Blablacar, Leboncoin, etc.) ? La loi vous
				oblige à les déclarer. Mais il peut être parfois difficile de s'y
				retrouver dans toute la documentation légale {emoji('🤔')}
			</p>
			<p>
				Suivez ce guide et vous saurez en quelques clics ce qu'il faut faire
				pour être en règle.
			</p>
			<div css="text-align: center">
				<Link
					to={sitePaths.économieCollaborative.activités.index}
					className="ui__ button plain cta">
					Commencer le guide
				</Link>
			</div>
			<p className="ui__ notice">
				PS : cet outil est là pour vous informer, pas pour repérer les fraudes :
				tout ce que vous saisissez reste dans votre navigateur. Vous pouvez donc
				répondre aux questions l'esprit léger, en toute transparence{' '}
				{emoji('😌')}
			</p>
		</Animate.fromBottom>
	)
})
