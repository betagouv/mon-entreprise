import { setSimulationConfig } from 'Actions/actions'
import Warning from 'Components/SimulateurWarning'
import Simulation from 'Components/Simulation'
import indépendantConfig from 'Components/simulationConfigs/indépendant.yaml'
import StackedBarChart from 'Components/StackedBarChart'
import { ThemeColorsContext } from 'Components/utils/colors'
import { IsEmbeddedContext } from 'Components/utils/embeddedContext'
import { getRuleFromAnalysis } from 'Engine/ruleUtils'
import { default as React, useContext } from 'react'
import { Helmet } from 'react-helmet'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router'
import { analysisWithDefaultsSelector } from 'Selectors/analyseSelectors'

export default function Indépendant() {
	const dispatch = useDispatch()
	const location = useLocation<{ fromGérer?: boolean }>()
	dispatch(setSimulationConfig(indépendantConfig, location.state?.fromGérer))
	const { t } = useTranslation()
	const inIframe = useContext(IsEmbeddedContext)

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
			{!inIframe && (
				<h1>
					<Trans i18nKey="simulateurs.indépendant.titre">
						Simulateur de revenus pour indépendants
					</Trans>
				</h1>
			)}
			<Warning simulateur="indépendant" />
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
			<h2>Répartition de la rémunération totale</h2>
			<StackedBarChart
				data={[
					{
						...getRule('revenu net après impôt'),
						title: t('Revenu disponible'),
						color: palettes[0][0]
					},
					{ ...getRule('impôt'), color: palettes[1][0] },
					{
						...getRule(
							'dirigeant . indépendant . cotisations et contributions'
						),
						title: t('Cotisations'),
						color: palettes[1][1]
					}
				]}
			/>
		</section>
	)
}
