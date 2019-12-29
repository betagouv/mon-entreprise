import { setSimulationConfig } from 'Actions/actions'
import { T } from 'Components'
import Warning from 'Components/SimulateurWarning'
import Simulation from 'Components/Simulation'
import autoEntrepreneurConfig from 'Components/simulationConfigs/auto-entrepreneur.yaml'
import StackedBarChart from 'Components/StackedBarChart'
import { ThemeColorsContext } from 'Components/utils/colors'
import { getRuleFromAnalysis } from 'Engine/rules'
import { default as React, useContext } from 'react'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { analysisWithDefaultsSelector } from 'Selectors/analyseSelectors'

export default function AutoEntrepreneur() {
	const dispatch = useDispatch()
	dispatch(setSimulationConfig(autoEntrepreneurConfig))

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
			<Warning simulateur="auto-entrepreneur" />
			<Simulation explanations={<ExplanationSection />} />
		</>
	)
}

function ExplanationSection() {
	const analysis = useSelector(analysisWithDefaultsSelector)
	const getRule = getRuleFromAnalysis(analysis)
	const { t } = useTranslation()
	const { palettes } = useContext(ThemeColorsContext)

	return (
		<section>
			<h2>Répartition du chiffre d'affaire</h2>
			<StackedBarChart
				data={[
					{
						...getRule('revenu net après impôt'),
						color: palettes[0][0]
					},
					{ ...getRule('impôt'), color: palettes[1][0] },
					{
						...getRule(
							'dirigeant . auto-entrepreneur . cotisations et contributions'
						),
						title: t('Cotisations'),
						color: palettes[1][1]
					}
				]}
			/>
		</section>
	)
}
