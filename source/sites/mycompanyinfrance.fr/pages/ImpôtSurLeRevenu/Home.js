import { emoji, React } from 'Components'
import { ScrollToTop } from 'Components/utils/Scroll'
import withSitePaths from 'Components/utils/withSitePaths'
import { Link } from 'react-router-dom'
import Animate from 'Ui/animate'
import illustration from '../../images/calculette.svg'
import Simulateur from './Simulateur'

export default withSitePaths(function Home({ sitePaths }) {
	return (
		<Animate.fromBottom>
			<ScrollToTop />
			<h1>Et moi, combien d'impôts je vais payer ?</h1>
			<p>Simulateur (très) simplifié d'impôt sur le revenu en 2019</p>

			<img
				css="max-width: 100%; height: 200px; margin: 2rem auto;display:block;"
				src={illustration}
			/>
			<Simulateur />
			<p className="ui__ notice">
				Attention, ce simulateur est en pleine construction, rien n'est garanti
				!
			</p>
		</Animate.fromBottom>
	)
})
