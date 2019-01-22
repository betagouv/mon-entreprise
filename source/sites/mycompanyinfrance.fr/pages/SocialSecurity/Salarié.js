import { React, T } from 'Components'
import SalaryExplanation from 'Components/SalaryExplanation'
import Simulation from 'Components/Simulation'
import salariéConfig from 'Components/simulationConfigs/salarié.yaml'
import withSimulationConfig from 'Components/simulationConfigs/withSimulationConfig'
import TargetSelection from 'Components/TargetSelection'
import withSitePaths from 'Components/utils/withSitePaths'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'

export let SalarySimulation = withSitePaths(({ sitePaths }) => (
	<Simulation
		targetsTriggerConversation={true}
		customEndMessages={
			<>
				<T k="simulation-end.hiring.text">
					Vous pouvez maintenant concrétiser votre projet d'embauche.
				</T>
				<div style={{ textAlign: 'center' }}>
					<Link className="ui__ button" to={sitePaths.démarcheEmbauche}>
						<T k="simulation-end.cta">Connaître les démarches</T>
					</Link>
				</div>
			</>
		}
		targets={<TargetSelection />}
		explanation={<SalaryExplanation />}
	/>
))

const Salarié = () => (
	<>
		<Helmet>
			<title>
				Salarié au régime général : cotisations et protection sociale{' '}
			</title>
			<meta
				name="description"
				content="Simulez les cotisations d'un salarié au régime général. Calcul complet de toutes les cotisations. Découvrez les contreparties garanties par sécurité sociale"
			/>
		</Helmet>
		<h1>Salarié au régime général</h1>
		<p>
			Dès que l'embauche d'un salarié est déclarée et qu'il est payé, il est
			couvert par le régime général de la Sécurité sociale (santé, maternité,
			invalidité, vieillesse, maladie professionnelle et accidents) et chômage.
		</p>
		<SalarySimulation />
	</>
)
export default withSimulationConfig(salariéConfig)(Salarié)
