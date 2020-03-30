import { setSimulationConfig } from 'Actions/actions'
import RuleLink from 'Components/RuleLink'
import Simulation from 'Components/Simulation'
import chomagePartielConfig from 'Components/simulationConfigs/chômage-partiel.yaml'
import { ThemeColorsContext } from 'Components/utils/colors'
import { IsEmbeddedContext } from 'Components/utils/embeddedContext'
import { Markdown } from 'Components/utils/markdown'
import { ScrollToTop } from 'Components/utils/Scroll'
import { formatValue } from 'Engine/format'
import { getRuleFromAnalysis } from 'Engine/ruleUtils'
import React, { useContext, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router'
import { analysisWithDefaultsSelector } from 'Selectors/analyseSelectors'
import styled from 'styled-components'
import { EvaluatedRule } from 'Types/rule'
import Animate from 'Ui/animate'

declare global {
	interface Window {
		STONLY_WID: string
	}
}

export default function ChômagePartiel() {
	const dispatch = useDispatch()
	const location = useLocation<{ fromGérer?: boolean }>()
	const inIframe = useContext(IsEmbeddedContext)
	dispatch(setSimulationConfig(chomagePartielConfig, location.state?.fromGérer))
	useEffect(() => {
		if (inIframe) {
			return
		}
		const script = document.createElement('script')
		window.STONLY_WID = '0128ae02-6780-11ea-ac13-0a4250848ba4'
		script.src = 'https://stonly.com/js/widget/stonly-widget.js'
		script.async = true
		document.body.appendChild(script)
		return () => {
			document.body.removeChild(script)
		}
	}, [])
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
			<ScrollToTop />
			{!inIframe && (
				<Trans i18nKey="coronavirus.description">
					<h1
						css={`
							margin-top: 1rem;
						`}
					>
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
	const {
		i18n: { language },
		t
	} = useTranslation()
	const { palettes } = useContext(ThemeColorsContext)
	const getRule = getRuleFromAnalysis(analysis)

	const net = getRule('contrat salarié . rémunération . net')
	const netHabituel = getRule('chômage partiel . revenu net habituel')
	const totalEntreprise = getRule('contrat salarié . prix du travail')
	const totalEntrepriseHabituel = getRule(
		'chômage partiel . coût employeur habituel'
	)
	if (!net?.nodeValue) {
		return null
	}
	return (
		<Animate.fromTop>
			<div
				id="targetSelection"
				className="ui__ light card"
				css={`
					margin: 1rem 0;
				`}
			>
				<div
					css={`
						margin: 0 -1rem;
					`}
				>
					<ComparaisonTable
						rows={[
							['', t('Habituellement'), t('Avec chômage partiel')],
							[
								net,
								netHabituel,
								{
									...net,
									additionalText: language === 'fr' && (
										<>
											<Trans>
												Soit{' '}
												<strong>
													{formatValue({
														value:
															(net.nodeValue / netHabituel.nodeValue) * 100,
														unit: '%',
														maximumFractionDigits: 0
													})}
												</strong>{' '}
												du revenu net
											</Trans>
										</>
									)
								}
							],
							[
								totalEntreprise,
								totalEntrepriseHabituel,
								{
									...totalEntreprise,
									additionalText: language === 'fr' && (
										<>
											Soit{' '}
											<strong>
												{formatValue({
													value:
														(totalEntreprise.nodeValue /
															totalEntrepriseHabituel.nodeValue) *
														100,
													unit: '%',
													maximumFractionDigits: 0
												})}
											</strong>{' '}
											du coût habituel
										</>
									)
								}
							]
						]}
					/>
				</div>
			</div>
		</Animate.fromTop>
	)
}

function ComparaisonTable({ rows: [head, ...body] }) {
	const columns = head.filter(x => x !== '')
	const [currentColumnIndex, setCurrentColumnIndex] = useState(
		columns.length - 1
	)

	return (
		<>
			<ResultTable className="ui__ mobile-version">
				<tr>
					<th></th>
					<th>
						<select
							onChange={evt => setCurrentColumnIndex(Number(evt.target.value))}
						>
							{columns.map((name, i) => (
								<option value={i} selected={i === currentColumnIndex}>
									{name}
								</option>
							))}
						</select>
					</th>
				</tr>
				<tbody>
					{body.map(([label, ...line], i) => (
						<tr key={i}>
							<td>
								<RowLabel {...label} />
							</td>
							<td>
								<ValueWithLink {...line[currentColumnIndex]} />
							</td>
						</tr>
					))}
				</tbody>
			</ResultTable>
			<ResultTable>
				<tr>
					{head.map((label, i) => (
						<th key={i}>{label}</th>
					))}
				</tr>
				{body.map(([label, ...line], i) => (
					<tr key={i}>
						<td>
							<RowLabel {...label} />
						</td>
						{line.map((cell, j) => (
							<td key={j}>
								{' '}
								<ValueWithLink {...cell} />
								{cell.additionalText && (
									<p
										className="ui__ notice"
										css={`
											text-align: right;
										`}
									>
										{cell.additionalText}
									</p>
								)}
							</td>
						))}
					</tr>
				))}
			</ResultTable>
		</>
	)
}

function ValueWithLink(rule: EvaluatedRule) {
	const { language } = useTranslation().i18n
	return (
		<RuleLink {...rule}>
			{formatValue({
				value: rule.nodeValue as number,
				language,
				unit: '€',
				maximumFractionDigits: 0
			})}
		</RuleLink>
	)
}

function RowLabel(target: EvaluatedRule) {
	return (
		<>
			{' '}
			<div className="optionTitle">{target.title}</div>
			<p>{target.summary}</p>
		</>
	)
}

const ResultTable = styled.table`
	width: 100%;
	border-collapse: collapse;
	margin-top: 5px;

	&.ui__.mobile-version {
		display: none;
		@media (max-width: 660px) {
			display: table;
		}
		td {
			text-align: center;
		}
	}

	&:not(.mobile-version) {
		display: none;
		@media (min-width: 660px) {
			display: table;
		}

		td:nth-child(2) {
			font-size: 1em;
			opacity: 0.8;
		}
		td {
			vertical-align: top;
			text-align: right;
		}
	}

	td {
		border-top: 1px solid rgba(0, 0, 0, 0.1);
		padding: 8px 16px 0;
	}

	td:first-child {
		text-align: left;
		p {
			font-style: italic;
		}
	}

	th:nth-child(n + 2) {
		white-space: nowrap;
		text-align: right;
		padding: 8px 16px;
	}

	th:first-child {
		width: 100%;
		padding-left: 10px;
		text-align: left;
	}

	td:nth-child(3) {
		font-weight: bold;
		p {
			font-weight: initial;
		}
	}

	td:last-child,
	th:last-child {
		background: var(--lighterColor);
	}
`

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
