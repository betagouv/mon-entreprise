import { React, T } from 'Components'
import PreviousSimulationBanner from 'Components/PreviousSimulationBanner'
import SalaryExplanation from 'Components/SalaryExplanation'
import Simulation from 'Components/Simulation'
import salariéConfig from 'Components/simulationConfigs/salarié.yaml'
import withSimulationConfig from 'Components/simulationConfigs/withSimulationConfig'
import TargetSelection from 'Components/TargetSelection'
import withSitePaths from 'Components/utils/withSitePaths'
import { compose } from 'ramda'
import { Helmet } from 'react-helmet'
import { withTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

export let SalarySimulation = withSitePaths(({ sitePaths }) => (
	<Simulation
		targetsTriggerConversation={true}
		customEndMessages={
			<>
				<T k="simulation-end.hiring.text">
					Vous pouvez maintenant concrétiser votre projet d'embauche.
				</T>
				{sitePaths.démarcheEmbauche && (
					<p style={{ textAlign: 'center' }}>
						<Link
							className="ui__ plain button"
							to={sitePaths.démarcheEmbauche.index}>
							<T k="simulation-end.cta">Connaître les démarches</T>
						</Link>
					</p>
				)}
			</>
		}
		targets={<TargetSelection explanation={<SalaryExplanation />} />}
	/>
))

const Salarié = ({ t }) => (
	<>
		<Helmet>
			<title>
				{t([
					'simulateurs.salarié.page.titre',
					'Calcul de salaire net et brut : simulateur officiel'
				])}
			</title>
			<meta
				name="description"
				content={t([
					'simulateurs.salarié.page.description',
					'Estimez les cotisations pour un salarié à partir du salaire brut, net ou "superbrut". Prise en comptes de toutes les cotisations du régime général et de l\'impôt sur le revenu. Découvrez les contreparties garanties par sécurité sociale'
				])}
			/>
		</Helmet>

		<div style={{ paddingTop: '2rem' }}>
			<SalarySimulation />
		</div>
		<PreviousSimulationBanner />
	</>
)
export default compose(
	withTranslation(),
	withSimulationConfig(salariéConfig)
)(Salarié)
