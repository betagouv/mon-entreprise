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
			<h1>Déclarer mes revenus des plateformes en ligne</h1>
			<img
				css="max-width: 100%; height: 200px; margin: 2rem auto;display:block;"
				src={illustration}
			/>
			<p>
				Vous avez des revenus issus des <strong>plateformes en ligne</strong>{' '}
				(Airbnb, Abritel, Drivy, Blablacar, Leboncoin, etc.) ?{' '}
			</p>

			<p>
				Vous devez les déclarer dans la plupart des cas. Cependant, il peut être
				difficile de s'y retrouver {emoji('🤔')}
			</p>
			<p>
				Suivez ce guide et vous saurez en quelques clics comment être en règle.
			</p>
			<div css="text-align: center">
				<Link
					to={sitePaths.économieCollaborative.activités.index}
					className="ui__ button plain cta">
					Commencer le guide
				</Link>
			</div>
			<p className="ui__ notice">
				PS : cet outil est là uniquement pour vous informer, aucune donnée ne
				sera transmise aux administrations {emoji('😌')}
			</p>
		</Animate.fromBottom>
	)
})
