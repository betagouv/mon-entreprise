import { setSimulationConfig } from 'Actions/actions'
import RuleLink from 'Components/RuleLink'
import Simulation from 'Components/Simulation'
import autoEntrepreneurConfig from 'Components/simulationConfigs/chômage-partiel.yaml'
import { IsEmbeddedContext } from 'Components/utils/embeddedContext'
import Value from 'Components/Value'
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
	dispatch(
		setSimulationConfig(autoEntrepreneurConfig, location.state?.fromGérer)
	)

	const { t } = useTranslation()

	return (
		<>
			<Helmet>
				<title>
					{t(
						'coronavirus.chômage-partiel.page.titre',
						'Coronavirus et chômage partiel : quel impact sur vos revenus ?'
					)}
				</title>
				<meta
					name="description"
					content={t(
						'coronavirus.chômage-partiel.page.description',
						'Estimez le revenus net avec les indemnités de chômage partiel'
					)}
				/>
			</Helmet>
			{!inIframe && (
				<Trans i18nKey="coronavirus.chômage-partiel.description">
					<h1>
						Coronavirus et chômage partiel : quel impact sur mes revenus ?
					</h1>
					<p>
						Le gouvernement met en place des mesures de soutien aux salariés
						touchés par la crise du Coronavirus. Parmis les mesures phares, la
						prise en charge de l'intégralité de l'indemnisation du chômage
						partiel par l'état.
					</p>
					<p>
						Ce simulateur permet de connaître votre revenu net si vous avez été
						mis en chômage partiel par votre entreprise, ainsi que le coût total
						restant à charge pour l'entreprise
					</p>
				</Trans>
			)}
			<Simulation results={<ExplanationSection />} />
		</>
	)
}

function ExplanationSection() {
	const analysis = useSelector(analysisWithDefaultsSelector)
	const getRule = getRuleFromAnalysis(analysis)

	const net = getRule('contrat salarié . rémunération . net')
	const indemnité = getRule(
		"contrat salarié . chômage partiel . indemnité d'activité partielle"
	)
	const totalEntreprise = getRule('contrat salarié . prix du travail')
	const perteRevenu = getRule('perte de revenu chômage partiel')
	if (!net?.nodeValue) {
		return null
	}
	return (
		<Animate.fromTop>
			{' '}
			<div
				className="ui__ light-bg card"
				css={`
					margin-top: 2rem;
					padding: 0.5rem;
				`}
			>
				<h3>
					<Trans>Revenu net avec chômage partiel :</Trans>{' '}
					<RuleLink {...net}>
						<Value {...net} />
					</RuleLink>
				</h3>
				<ul>
					<li>
						<Trans>
							Indemnité chômage partiel prise en charge par l'état :
						</Trans>{' '}
						<RuleLink {...indemnité}>
							<Value {...indemnité} />
						</RuleLink>{' '}
					</li>
					<li>
						<Trans>Total payé par l'entreprise :</Trans>{' '}
						<RuleLink {...totalEntreprise}>
							<Value {...totalEntreprise} />
						</RuleLink>
					</li>
					<li>
						<Trans>Perte de revenu net :</Trans>{' '}
						<RuleLink {...perteRevenu}>
							<Value {...perteRevenu} />
						</RuleLink>
					</li>
				</ul>
			</div>
		</Animate.fromTop>
	)
}
