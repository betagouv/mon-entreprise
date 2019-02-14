import { React } from 'Components'
import AlphaWarning from 'Components/AlphaWarning'
import Simulation from 'Components/Simulation'
import indépendantConfig from 'Components/simulationConfigs/indépendant.yaml'
import withSimulationConfig from 'Components/simulationConfigs/withSimulationConfig'
import TargetSelection from 'Components/TargetSelection'
import emoji from 'react-easy-emoji'
import { Helmet } from 'react-helmet'

const Indépendant = () => (
	<>
		<Helmet>
			<title>Dirigeant indépendant : cotisations et protection sociale </title>
			<meta
				name="description"
				content="Simulez votre rémunération en tant que dirigeant indépendant. Calcul complet de toutes les cotisations. Découvrez les droits ouverts par votre affiliation au régime des indépendants (TNS)"
			/>
		</Helmet>
		<h1>Dirigeant indépendant : cotisations et droits</h1>
		<p>
			Les personnes suivantes relèvent de la sécurité sociale des indépendants :
		</p>
		<ul>
			<li> entrepreneurs individuels et EIRL</li>
			<li> gérants et associés de SNC et EURL</li>
			<li> gérant majoritaire de SARL</li>
		</ul>
		<AlphaWarning />
		<Simulation
			targetsTriggerConversation={true}
			targets={<TargetSelection />}
			explanation={
				<>
					<AvertissementForfaitIndépendants />
					<AvertissementProtectionSocialeIndépendants />
				</>
			}
		/>
	</>
)

let AvertissementForfaitIndépendants = () => (
	<p className="ui__ notice">
		{emoji('💶 ')}Notre estimation prend en compte les{' '}
		<em>cotisations réelles</em> dues par le travailleur indépendant. Pendant la
		première année de son activité, il ne paiera qu'un forfait réduit (une somme
		de l'ordre de 3000€ / an pour un artisan)... mais il sera régularisé l'année
		suivante selon ce montant réel.
	</p>
)

export let AvertissementProtectionSocialeIndépendants = () => (
	<p className="ui__ notice">
		{emoji('☂️ ')}La sécurité sociale des indépendants ne couvre ni les
		accidents du travail, ni la perte d'emploi (assurance-chômage), et offre une
		retraite plus faible que celle des salariés. Pour être couvert, le
		professionnel peut souscrire volontairement des assurances spécifiques.
	</p>
)

export default withSimulationConfig(indépendantConfig)(Indépendant)
