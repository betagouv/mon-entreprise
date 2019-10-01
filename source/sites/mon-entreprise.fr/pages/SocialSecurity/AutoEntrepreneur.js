import { T } from 'Components'
import Warning from 'Components/SimulateurWarning'
import Simulation from 'Components/Simulation'
import StackedBarChart from 'Components/StackedBarChart'
import indépendantConfig from 'Components/simulationConfigs/auto-entrepreneur.yaml'
import withSimulationConfig from 'Components/simulationConfigs/withSimulationConfig'
import { getRuleFromAnalysis } from 'Engine/rules'
import { analysisWithDefaultsSelector } from 'Selectors/analyseSelectors'
import { useSelector } from 'react-redux'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'
import { AvertissementProtectionSocialeIndépendants } from './Indépendant'

const AutoEntrepreneur = () => {
	const { t } = useTranslation()
	return (
		<>
			<Helmet>
				<title>
					{t(
						'simulateurs.auto-entrepreneur.page.titre',
						'Auto-entrepreneur : simulateur officiel de revenus et de cotisations'
					)}
				</title>
				<meta
					name="description"
					content={t(
						'simulateurs.auto-entrepreneur.page.description',
						"Estimez vos revenus en tant qu'auto-entrepreneur à partir de votre chiffre d'affaire. Prise en compte de toutes les cotisations et de l'impôt sur le revenu. Simulateur officiel de l'Urssaf"
					)}
				/>
			</Helmet>
			<h1>
				<T k="simulateurs.auto-entrepreneur.titre">
					Simulateur de revenus auto-entrepreneur
				</T>
			</h1>
			<Warning simulateur="auto-entreprise" />
			<Simulation
				explanation={<AvertissementProtectionSocialeIndépendants />}
				explanations={<ExplanationSection />}
			/>
		</>
	)
}

export default withSimulationConfig(indépendantConfig)(AutoEntrepreneur)

function ExplanationSection() {
	const analysis = useSelector(analysisWithDefaultsSelector)
	const getRule = getRuleFromAnalysis(analysis)
	const { t } = useTranslation()

	return (
		<section>
			<h2>Répartition du chiffre d'affaire</h2>
			<StackedBarChart
				data={[
					{
						...getRule('revenu net après impôt'),
						color: '#4D96A7'
					},
					{ ...getRule('impôt'), color: '#A74D92' },
					{
						...getRule('auto-entrepreneur . cotisations et contributions'),
						name: t('Cotisations'),
						color: '#724DA7'
					}
				]}
			/>
		</section>
	)
}
