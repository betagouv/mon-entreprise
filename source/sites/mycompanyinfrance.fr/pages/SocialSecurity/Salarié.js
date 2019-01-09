import Simulateur from 'Components/SalarySimulation'
import salariéConfig from 'Components/simulationConfigs/salarié.yaml'
import withSimulationConfig from 'Components/simulationConfigs/withSimulationConfig'
import React from 'react'
import { Helmet } from 'react-helmet'

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
		<h1>
			Salarié au régime général
			<small id="betaTag">alpha</small>
		</h1>
		<p>
			Dès que l'embauche d'un salarié est déclarée et qu'il est payé, il est
			couvert par le régime général de la Sécurité sociale (santé, maternité,
			invalidité, vieillesse, maladie professionnelle et accidents) et chômage.
		</p>
		<Simulateur />
	</>
)
export default withSimulationConfig(salariéConfig)(Salarié)
