import withSitePaths from 'Components/utils/withSitePaths'
import React from 'react'
import Animate from 'Ui/animate'
import { CheckItem, Checklist } from 'Ui/Checklist'
import pizzaSharing from './images/pizzaSharing.svg'

export default withSitePaths(function CoConsommation({ sitePaths }) {
	return (
		<Animate.fromBottom>
			<h1>Co-consommation</h1>
			<img
				css="max-width: 100%; height: 200px; margin: 2rem auto;display:block;"
				src={pizzaSharing}
			/>
			<p>
				La co-consommation, c'est par exemple partagez votre voiture
				(co-voiturage), des repas, ou encore des sorties. Le site le plus
				emblématique est Blablacar.
			</p>
			<p>
				Pour que ces revenus ne soient pas considérés comme des revenus
				professionnels, vous devez confirmer ces deux conditions :
			</p>
			<Checklist key={'coConsommation'}>
				<CheckItem
					name="jeSuisBénéficiaire"
					title="Je fait partie des bénéficiaires du service"
					explanations="Les revenus que vous réalisez au titre du partage des frais sont perçus dans le cadre d’une « co-consommation », ce qui signifie que vous bénéficiez également de la prestation de service proposée au même titre que les personnes avec lesquelles les frais sont partagés"
				/>
				<CheckItem
					name="pasPlusCher"
					title="Je ne fait pas payer les autres plus cher que cela me coute réellement (pas de bénéfice)"
					explanations="Les revenus perçus n’excèdent pas le montant des coûts directs engagés à l’occasion de la prestation. Ils ne doivent couvrir que les frais supportés à l’occasion du service rendu (hors frais liés à l’acquisition, l’entretien ou l’utilisation personnelle du bien partagé)"
				/>
			</Checklist>
			<p className="ui__ answer-group">
				<button className="ui__ simple button">Ce n'est pas le cas</button>
				<button className="ui__ plain button" disabled>
					Continuer
				</button>
			</p>
		</Animate.fromBottom>
	)
})
