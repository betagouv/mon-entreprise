import { React, T } from 'Components'
import Warning from 'Components/SimulateurWarning'
import Simulation from 'Components/Simulation'
import indépendantConfig from 'Components/simulationConfigs/indépendant.yaml'
import withSimulationConfig from 'Components/simulationConfigs/withSimulationConfig'
import TargetSelection from 'Components/TargetSelection'
import { compose } from 'ramda'
import emoji from 'react-easy-emoji'
import { Helmet } from 'react-helmet'
import { withTranslation } from 'react-i18next'

const Indépendant = ({ t }) => (
	<>
		<Helmet>
			<title>
				{t([
					'simulateurs.indépendant.page.titre',
					'Indépendant : simulateur officiel de revenus et de cotisations'
				])}
			</title>
			<meta
				name="description"
				content={t([
					'simulateurs.indépendant.page.description',
					"Estimez vos revenus en tant qu'indépendant à partir de votre chiffre d'affaire (pour les EI et les gérants EURL et SARL majoritaires). Prise en compte de toutes les cotisations et de l'impôt sur le revenu. Simulateur officiel de l'Urssaf"
				])}
			/>
		</Helmet>
		<h1>
			<T k="simulateurs.indépendant.titre">
				Simulateur de revenus pour indépendants
			</T>
		</h1>

		<Warning />
		<Simulation
			targetsTriggerConversation={true}
			targets={
				<TargetSelection
					explanation={
						<>
							<AvertissementForfaitIndépendants />
							<AvertissementProtectionSocialeIndépendants />
						</>
					}
				/>
			}
		/>
	</>
)

let AvertissementForfaitIndépendants = () => (
	<p>
		{emoji('💶')}{' '}
		<T k="simulateurs.indépendant.explication1">
			Notre estimation prend en compte les <em>cotisations réelles</em> dues par
			le travailleur indépendant. Pendant la première année de son activité, il
			paiera un forfait réduit (une somme de l'ordre de 1300€ / an pour un
			artisan bénéficiant de l'ACRE)... mais il sera régularisé l'année suivante
			selon ce montant réel.
		</T>
	</p>
)

export let AvertissementProtectionSocialeIndépendants = () => (
	<p>
		{emoji('☂️')}{' '}
		<T k="simulateurs.indépendant.explication1">
			Les assurances chômage et accidents du travail ne sont pas prises en
			charge au sein de la Sécurité sociale des indépendants. La retraite basée
			sur le revenu professionnel est généralement plus faible. Pour être
			couvert le professionnel peut souscrire des assurances complémentaires.
		</T>
	</p>
)

export default compose(
	withTranslation(),
	withSimulationConfig(indépendantConfig)
)(Indépendant)
