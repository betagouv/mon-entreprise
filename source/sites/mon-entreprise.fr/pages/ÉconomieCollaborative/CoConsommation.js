import classnames from 'classnames'
import { ScrollToTop } from 'Components/utils/Scroll'
import withSitePaths from 'Components/utils/withSitePaths'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Animate from 'Ui/animate'
import { CheckItem } from 'Ui/Checklist'
import pizzaSharing from './images/pizzaSharing.svg'

export default withSitePaths(function CoConsommation({ sitePaths }) {
	const [checklist, setChecklist] = useState([false, false])
	return (
		<Animate.fromBottom>
			<ScrollToTop />
			<h1>Co-consommation</h1>
			<img
				css="max-width: 100%; height: 200px; margin: 2rem auto;display:block;"
				src={pizzaSharing}
			/>
			<p>
				La co-consommation, c'est par exemple partager votre voiture
				(co-voiturage), des repas, ou encore des sorties.
			</p>
			<p>
				<em>Exemples de plateforme : Blablacar</em>
			</p>
			<p>
				Pour que ces revenus ne soient pas considérés comme des revenus
				professionnels, vous devez confirmer ces deux conditions :
			</p>

			<CheckItem
				name="jeSuisBénéficiaire"
				title="Je fait partie des bénéficiaires du service"
				explanations={
					<p>
						Les revenus que vous réalisez au titre du partage des frais sont
						perçus dans le cadre d’une « co-consommation », ce qui signifie que
						vous bénéficiez également de la prestation de service proposée au
						même titre que les personnes avec lesquelles les frais sont partagés
					</p>
				}
				onChange={checked => setChecklist([checked, checklist[1]])}
			/>
			<CheckItem
				name="pasPlusCher"
				title="Je ne fait pas payer les autres plus cher que cela me coute réellement (pas de bénéfice)"
				explanations={
					<p>
						Les revenus perçus n’excèdent pas le montant des coûts directs
						engagés à l’occasion de la prestation. Ils ne doivent couvrir que
						les frais supportés à l’occasion du service rendu (hors frais liés à
						l’acquisition, l’entretien ou l’utilisation personnelle du bien
						partagé)
					</p>
				}
				onChange={checked => setChecklist([checklist[0], checked])}
			/>
			<p className="ui__ answer-group">
				<button className="ui__ simple button">Ce n'est pas le cas</button>
				<Link
					to={sitePaths.économieCollaborative.locationMeublée}
					className={classnames('ui__ plain button', {
						disabled: checklist.filter(Boolean).length !== 2
					})}>
					Continuer
				</Link>
			</p>
		</Animate.fromBottom>
	)
})
