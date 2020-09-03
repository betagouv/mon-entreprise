import Warning from 'Components/SimulateurWarning'
import Simulation from 'Components/Simulation'
import professionnelSantéConfig from 'Components/simulationConfigs/professionnel-santé.yaml'
import StackedBarChart from 'Components/StackedBarChart'
import { ThemeColorsContext } from 'Components/utils/colors'
import { IsEmbeddedContext } from 'Components/utils/embeddedContext'
import { EngineContext } from 'Components/utils/EngineContext'
import { default as React, useContext } from 'react'
import { Helmet } from 'react-helmet'
import { Trans, useTranslation } from 'react-i18next'

export default function ProfessionnelSanté() {
	const { t } = useTranslation()
	const inIframe = useContext(IsEmbeddedContext)

	return (
		<>
			<Helmet>
				<title>
					{t(
						'simulateurs.professionnel-santé.page.titre',
						'ProfessionnelSanté : simulateur de revenus et de cotisations'
					)}
				</title>
				<meta
					name="description"
					content={t(
						'simulateurs.professionnel-santé.page.description',
						"Estimez vos revenus en tant qu'professionnelSanté à partir de votre chiffre d'affaire (pour les EI et les gérants EURL et SARL majoritaires). Prise en compte de toutes les cotisations et de l'impôt sur le revenu. Simulateur officiel de l'Urssaf"
					)}
				/>
			</Helmet>
			{!inIframe && (
				<h1>
					<Trans i18nKey="simulateurs.professionnel-santé.titre">
						Simulateur de revenus pour les professionnels de santé
					</Trans>
				</h1>
			)}
			{/* <Warning simulateur="professionnelSanté" /> */}
			<Simulation
				config={professionnelSantéConfig}
				explanations={<ExplanationSection />}
			/>
		</>
	)
}

function ExplanationSection() {
	const engine = useContext(EngineContext)
	const { t } = useTranslation()
	const { palettes } = useContext(ThemeColorsContext)

	return (
		<section>
			<h2>Répartition de la rémunération totale</h2>
			<StackedBarChart
				data={[
					{
						...engine.evaluate('revenu net après impôt'),
						title: t('Revenu disponible'),
						color: palettes[0][0]
					},
					{ ...engine.evaluate('impôt'), color: palettes[1][0] },
					{
						...engine.evaluate(
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
