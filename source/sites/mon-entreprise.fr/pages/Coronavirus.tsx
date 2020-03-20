import { setSimulationConfig } from 'Actions/actions'
import RuleLink from 'Components/RuleLink'
import Simulation from 'Components/Simulation'
import chomagePartielConfig from 'Components/simulationConfigs/chômage-partiel.yaml'
import StackedBarChart from 'Components/StackedBarChart'
import { ThemeColorsContext } from 'Components/utils/colors'
import { IsEmbeddedContext } from 'Components/utils/embeddedContext'
import { Markdown } from 'Components/utils/markdown'
import { formatValue } from 'Engine/format'
import { getRuleFromAnalysis } from 'Engine/rules'
import React, { useContext } from 'react'
import { Helmet } from 'react-helmet'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router'
import { analysisWithDefaultsSelector } from 'Selectors/analyseSelectors'
import Animate from 'Ui/animate'

export default function ChômagePartiel() {
	const dispatch = useDispatch()
	const location = useLocation<{ fromGérer?: boolean }>()
	const inIframe = useContext(IsEmbeddedContext)
	dispatch(setSimulationConfig(chomagePartielConfig, location.state?.fromGérer))

	const { t } = useTranslation()

	return (
		<>
			<Helmet>
				<title>
					{t(
						'coronavirus.page.titre',
						'Coronavirus et chômage partiel : quel impact sur vos revenus ?'
					)}
				</title>
				<meta
					name="description"
					content={t(
						'coronavirus.page.description',
						'Estimez le revenus net avec les indemnités de chômage partiel'
					)}
				/>
			</Helmet>
			{!inIframe && (
				<Trans i18nKey="coronavirus.description">
					<h1>
						<span
							css={`
								font-size: 0.65em;
								opacity: 0.85;
							`}
						>
							Coronavirus et chômage partiel
						</span>
						<br />
						Quel impact sur mes revenus ?
					</h1>
					<p>
						Le gouvernement met en place des mesures de soutien aux salariés
						touchés par la crise du Covid-19. Parmi les mesures phares, la prise
						en charge de l'intégralité de l'indemnisation du chômage partiel par
						l'État.
					</p>
					<p>
						Ce simulateur permet de connaître le revenu net versé au salarié,
						ainsi que le coût total restant à charge pour l'entreprise en cas de
						chômage partiel.
					</p>
				</Trans>
			)}
			<Simulation
				results={<ExplanationSection />}
				customEndMessages={
					<span className="ui__ notice">Voir les résultats au-dessus</span>
				}
				showPeriodSwitch={false}
			/>
			{!inIframe && <TextExplanations />}
		</>
	)
}

function ExplanationSection() {
	const analysis = useSelector(analysisWithDefaultsSelector)
	const { language } = useTranslation().i18n
	const { palettes } = useContext(ThemeColorsContext)
	const getRule = getRuleFromAnalysis(analysis)

	const net = getRule('contrat salarié . rémunération . net')
	const indemnité = getRule('contrat salarié . chômage partiel . indemnités')
	const totalEntreprise = getRule('contrat salarié . prix du travail')
	const perteRevenu = getRule('perte de revenu chômage partiel')
	if (!net?.nodeValue) {
		return null
	}
	return (
		<Animate.fromTop>
			<div
				css={`
					margin-top: 2rem;
				`}
			></div>
			<div
				className="ui__ light card"
				css={`
					margin: 3rem 0;
				`}
			>
				<div id="targetSelection">
					<ul className="targets">
						<li>
							<div className="main">
								<span className="optionTitle">
									<Trans>Revenu net avec chômage partiel</Trans>
								</span>
								<div className="targetInputOrValue">
									<RuleLink {...net}>
										{formatValue({
											value: net.nodeValue,
											language,
											unit: '€',
											maximumFractionDigits: 0
										})}
									</RuleLink>
								</div>
							</div>
						</li>
						<li className="small-target">
							<div className="main">
								<Trans>Coût pour l'entreprise</Trans>
								<div className="targetInputOrValue">
									<RuleLink {...totalEntreprise}>
										{formatValue({
											value: totalEntreprise.nodeValue,
											language,
											unit: '€',
											maximumFractionDigits: 0
										})}
									</RuleLink>
								</div>
							</div>
						</li>
						<li>
							<span className="optionTitle">
								<Trans>Part du salaire net maintenu</Trans>
							</span>
							<StackedBarChart
								data={[
									{
										...net,
										title: 'net avec chômage partiel',
										color: palettes[0][0]
									},
									{
										...perteRevenu,
										title: 'Perte de revenu',
										color: palettes[1][0]
									}
								]}
							/>
						</li>
					</ul>
				</div>
			</div>
		</Animate.fromTop>
	)
}

function TextExplanations() {
	const { i18n } = useTranslation()
	if (i18n.language !== 'fr') {
		return null
	}
	return (
		<Markdown
			css={`
				margin-top: 2rem;
			`}
			source={`
[👨‍💻 Intégrer ce simulateur sur votre site](/intégration/iframe?module=simulateur-chomage-partiel)


## Pour l'entreprise : déclarer une activité partielle 📫


Face à la crise du coronavirus, les modalités de passage en activité partielle
ont été allégées. L'employeur est autorisé a placer ses salariés en activité
partielle avant que la demande officielle ne soit déposée. Celui-ci dispose
ensuite d'un délai de **30 jours** pour se mettre en règle. Les
indemnités seront versées avec un effet rétro-actif débutant à la mise en place
du chômage partiel.

[➡ Effectuer la demande de chômage partiel](https://activitepartielle.emploi.gouv.fr/aparts/).

## Indépendants 🚶‍♀️

Les petites entreprises et les indépendants qui subissent une fermeture
administrative OU qui auront connu une perte de chiffre d'affaires d'au moins
70% au mois de mars 2020 par rapport au mois de mars 2019 bénéficieront d'une
aide automatique de **1 500 euros**. Pour bénéficier de cette aide il faudra
faire une déclaration sur le site de la DGFiP.

[➡ Plus d'informations sur les mesures de soutien aux entreprises](https://www.economie.gouv.fr/coronavirus-soutien-entreprises)

## Prime pour les salariés présents 👨‍🔬

Le gouvernement invite les entreprises à verser une prime de **1 000 euros**
défiscalisée et désocialisée à leurs salariés qui se rendent sur leur lieu de
travail pendant la crise sanitaire du coronavirus. Cette prime fonctionnerait
sur le même modèle que la « prime Macron » décidée à la suite de la crise des
gilets jaunes, mais les détails ne sont pas encore connus.
	`}
		/>
	)
}
