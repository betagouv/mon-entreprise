import { React, T } from 'Components'
import { getRuleFromAnalysis } from 'Engine/rules'
import Warning from 'Components/SimulateurWarning'
import Simulation from 'Components/Simulation'
import StackedBarChart from 'Components/StackedBarChart'
import indépendantConfig from 'Components/simulationConfigs/indépendant.yaml'
import withSimulationConfig from 'Components/simulationConfigs/withSimulationConfig'
import { analysisWithDefaultsSelector } from 'Selectors/analyseSelectors'
import emoji from 'react-easy-emoji'
import { Helmet } from 'react-helmet'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

export default withSimulationConfig(indépendantConfig)(function Indépendant() {
	const { t } = useTranslation()
	return (
		<>
			<Helmet>
				<title>
					{t(
						'simulateurs.indépendant.page.titre',
						'Indépendant : simulateur officiel de revenus et de cotisations'
					)}
				</title>
				<meta
					name="description"
					content={t(
						'simulateurs.indépendant.page.description',
						"Estimez vos revenus en tant qu'indépendant à partir de votre chiffre d'affaire (pour les EI et les gérants EURL et SARL majoritaires). Prise en compte de toutes les cotisations et de l'impôt sur le revenu. Simulateur officiel de l'Urssaf"
					)}
				/>
			</Helmet>
			<h1>
				<T k="simulateurs.indépendant.titre">
					Simulateur de revenus pour indépendants
				</T>
			</h1>
			<Warning />
			<Simulation explanations={<ExplanationSection />} />
		</>
	)
})

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
						name: t('Revenu disponible'),
						color: '#4D96A7'
					},
					{ ...getRule('impôt'), color: '#A74D92' },
					{
						...getRule('indépendant . cotisations et contributions'),
						name: t('Cotisations'),
						color: '#724DA7'
					}
				]}
			/>
		</section>
	)
}
