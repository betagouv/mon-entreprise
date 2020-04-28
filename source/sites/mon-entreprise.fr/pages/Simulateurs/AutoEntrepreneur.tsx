import Warning from 'Components/SimulateurWarning'
import Simulation from 'Components/Simulation'
import autoEntrepreneurConfig from 'Components/simulationConfigs/auto-entrepreneur.yaml'
import StackedBarChart from 'Components/StackedBarChart'
import { ThemeColorsContext } from 'Components/utils/colors'
import { IsEmbeddedContext } from 'Components/utils/embeddedContext'
import { EngineContext } from 'Components/utils/EngineContext'
import { default as React, useContext } from 'react'
import { Helmet } from 'react-helmet'
import { Trans, useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { targetUnitSelector } from 'Selectors/simulationSelectors'

export default function AutoEntrepreneur() {
	const inIframe = useContext(IsEmbeddedContext)
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
			{!inIframe && (
				<h1>
					<Trans i18nKey="simulateurs.auto-entrepreneur.titre">
						Simulateur de revenus auto-entrepreneur
					</Trans>
				</h1>
			)}
			<Warning simulateur="auto-entrepreneur" />
			<Simulation
				config={autoEntrepreneurConfig}
				explanations={<ExplanationSection />}
			/>
		</>
	)
}

function ExplanationSection() {
	const engine = useContext(EngineContext)
	const { t } = useTranslation()
	const { palettes } = useContext(ThemeColorsContext)
	const targetUnit = useSelector(targetUnitSelector)
	const impôt = engine.evaluate('impôt', { unit: targetUnit })

	return (
		<section>
			<h2>
				<Trans>Répartition du chiffre d'affaires</Trans>
			</h2>
			<StackedBarChart
				data={[
					{
						...engine.evaluate(
							'dirigeant . auto-entrepreneur . net après impôt',
							{ unit: targetUnit }
						),
						title: t("Revenu (incluant les dépenses liées à l'activité)"),
						color: palettes[0][0]
					},

					...(impôt.nodeValue
						? [{ ...impôt, title: t('impôt'), color: palettes[1][0] }]
						: []),
					{
						...engine.evaluate(
							'dirigeant . auto-entrepreneur . cotisations et contributions',
							{ unit: targetUnit }
						),
						title: t('Cotisations'),
						color: palettes[1][1]
					}
				]}
			/>
		</section>
	)
}
