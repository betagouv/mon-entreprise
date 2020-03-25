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
import React, { useContext, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router'
import { analysisWithDefaultsSelector } from 'Selectors/analyseSelectors'
import styled from 'styled-components'
import { EvaluatedRule } from 'Types/rule'
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
	const [showTable, setShowTable] = useState(false)

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
					padding: 1rem 0;
				`}
			>
				<p>
					Le chômage partiel permet d'obenir un revenu net de{' '}
					<strong>
						{formatValue({
							value: net.nodeValue,
							language,
							unit: '€',
							maximumFractionDigits: 0
						})}
					</strong>
					.
					<br />
					Soit{' '}
					<strong>
						{formatValue({
							value: (net.nodeValue / netHabituel.nodeValue) * 100,
							unit: '%',
							maximumFractionDigits: 0
						})}
					</strong>{' '}
					du revenu net habituel.{' '}
					<button
						className="ui__ link-button"
						onClick={() => setShowTable(!showTable)}
					>
						Détails ▾
					</button>
				</p>
				{showTable && (
					<Animate.fromTop>
						<ComparaisonTable
							rows={[
								['', t('Habituellement'), t('Avec chômage partiel')],
								[net, netHabituel, net],
								[totalEntreprise, totalEntrepriseHabituel, totalEntreprise]
							]}
						/>
					</Animate.fromTop>
				)}
				<div
					className="optionTitle"
					css={`
						padding: 1rem 0;
						border-top: 1px solid rgba(0, 0, 0, 0.1);
					`}
				>
					<Trans>Prise en charge du revenu net avec chômage partiel</Trans>
				</div>
				<StackedBarChart
					data={[
						{
							...getRule(
								'contrat salarié . activité partielle . indemnisation entreprise'
							),
							title: t('État'),
							color: palettes[0][0]
						},
						{
							...totalEntreprise,
							title: t('Employeur'),
							color: palettes[1][0]
						}
					]}
				/>
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
	}

	td {
		border-top: 1px solid rgba(0, 0, 0, 0.1);
		padding: 8px 16px 0;

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
	}

	td:nth-child(n + 2) {
		text-align: right;
		font-size: 1.3em;
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
