import { setSimulationConfig } from 'Actions/actions'
import RuleLink from 'Components/RuleLink'
import Simulation from 'Components/Simulation'
import chomagePartielConfig from 'Components/simulationConfigs/chômage-partiel.yaml'
import StackedBarChart from 'Components/StackedBarChart'
import { ThemeColorsContext } from 'Components/utils/colors'
import { IsEmbeddedContext } from 'Components/utils/embeddedContext'
import { Markdown } from 'Components/utils/markdown'
import { ScrollToTop } from 'Components/utils/Scroll'
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
			<ScrollToTop key={location.pathname} />
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
			<ScrollToTop />
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
	const totalEntreprise = getRule('contrat salarié . prix du travail')
	const perteRevenu = getRule('différence de revenu chômage partiel')
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
								<div>
									<div className="optionTitle">
										<Trans>Revenu net mensuel</Trans>
									</div>
									<p>
										<Trans>En incluant l'indemnité de chômage partiel</Trans>
									</p>
								</div>
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
								<Trans>Part du salaire net maintenue</Trans>
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
										title: 'Différence de revenu',
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

[➡ Effectuer la demande de chômage partiel](https://www.service-public.fr/professionnels-entreprises/vosdroits/R31001).

## Indépendants 🚶‍♀️

Les petites entreprises et les indépendants qui subissent une fermeture
administrative OU qui auront connu une perte de chiffre d'affaires d'au moins
70% au mois de mars 2020 par rapport au mois de mars 2019 bénéficieront d'une
aide de **1 500 euros**. Pour bénéficier de cette aide forfaitaire il faudra
faire une déclaration sur le site de la DGFiP.

➡ Plus d'informations sur le site du 
[Ministère de l'Économie](https://www.economie.gouv.fr/coronavirus-soutien-entreprises) 
et de l'[Urssaf](https://www.urssaf.fr/portail/home/actualites/foire-aux-questions.html).

## Prime pour les salariés présents 👨‍🔬

Le gouvernement invite les entreprises à verser une prime de **1 000 euros**
défiscalisée et désocialisée à leurs salariés qui se rendent sur leur lieu de
travail pendant la crise sanitaire du coronavirus. Il s'agit de la « prime
exceptionnelle de pouvoir d'achat » décidée à la suite de la crise des gilets
jaunes dont le recours est encouragé, notamment en supprimant l'obligation de
signer un accord d'intéressement pour bénéficier de l'exonération sociale et
fiscale.
	`}
		/>
	)
}
