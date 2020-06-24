import RuleLink from 'Components/RuleLink'
import Simulation from 'Components/Simulation'
import chomagePartielConfig from 'Components/simulationConfigs/chômage-partiel.yaml'
import Animate from 'Components/ui/animate'
import Warning from 'Components/ui/WarningBlock'
import { IsEmbeddedContext } from 'Components/utils/embeddedContext'
import { useEvaluation } from 'Components/utils/EngineContext'
import { Markdown } from 'Components/utils/markdown'
import { ScrollToTop } from 'Components/utils/Scroll'
import { EvaluatedRule, formatValue } from 'publicodes'
import React, { useContext, useEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { DottedName } from 'Rules'
import styled from 'styled-components'
import { productionMode } from '../../../../utils'
import ChômagePartielPreview from './images/ChômagePartielPreview.png'
import Meta from 'Components/utils/Meta'

declare global {
	interface Window {
		STONLY_WID: string
	}
}

export default function ChômagePartiel() {
	const inIframe = useContext(IsEmbeddedContext)
	useEffect(() => {
		if (inIframe || !productionMode) {
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
	const { t, i18n } = useTranslation()
	const META = {
		title: t(
			'pages.simulateurs.chômage-partiel.meta.titre',
			"Calcul de l'indemnité chômage partiel : le simulateur Urssaf"
		),
		description: t(
			'pages.simulateurs.chômage-partiel.meta.description',
			"Calcul du revenu net pour l'employé et du reste à charge pour l'employeur après remboursement de l'Etat, en prenant en compte toutes les cotisations sociales."
		),
		ogTitle: t(
			'pages.simulateurs.chômage-partiel.meta.ogTitle',
			"Simulateur chômage partiel : découvrez l'impact sur le revenu net salarié et le coût total employeur."
		),
		ogDescription: t(
			'pages.simulateurs.chômage-partiel.meta.ogDescription',
			"Accédez à une première estimation en saisissant à partir d'un salaire brut. Vous pourrez ensuite personaliser votre situation (temps partiel, convention, etc). Prends en compte la totalité des cotisations, y compris celles spécifiques à l'indemnité (CSG et CRDS)."
		),
		...(i18n.language === 'fr' && { ogImage: ChômagePartielPreview })
	}
	return (
		<>
			<Meta {...META} />

			<ScrollToTop />
			{!inIframe && (
				<Trans i18nKey="coronavirus.description">
					<h1>Covid-19 : Simulateur de chômage partiel</h1>
				</Trans>
			)}

			<Warning localStorageKey="covid19">
				<ul>
					<li>
						Ce simulateur ne prend pas en compte les rémunérations brut définies
						sur 39h hebdomadaires.
					</li>
				</ul>
			</Warning>
			<Simulation
				config={chomagePartielConfig}
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
	const {
		i18n: { language },
		t
	} = useTranslation()

	const net = useEvaluation('contrat salarié . rémunération . net')
	const netHabituel = useEvaluation('chômage partiel . revenu net habituel')
	const totalEntreprise = useEvaluation('contrat salarié . prix du travail')
	const totalEntrepriseHabituel = useEvaluation(
		'chômage partiel . coût employeur habituel'
	)
	if (
		typeof net?.nodeValue !== 'number' ||
		typeof netHabituel?.nodeValue !== 'number' ||
		typeof totalEntreprise?.nodeValue !== 'number' ||
		typeof totalEntrepriseHabituel?.nodeValue !== 'number'
	) {
		return null
	}
	return (
		<Animate.fromTop>
			<div
				id="targetSelection"
				className="ui__ light card"
				css={`
					overflow: hidden;
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
										<span data-test-id="comparaison-net">
											Soit{' '}
											<strong>
												{formatValue(
													(net.nodeValue / netHabituel.nodeValue) * 100,
													{ displayedUnit: '%', precision: 0 }
												)}
											</strong>{' '}
											du revenu net
										</span>
									)
								}
							],
							[
								totalEntreprise,
								totalEntrepriseHabituel,
								{
									...totalEntreprise,
									additionalText: language === 'fr' && (
										<span data-test-id="comparaison-total">
											Soit{' '}
											<strong>
												{formatValue(
													(totalEntreprise.nodeValue /
														totalEntrepriseHabituel.nodeValue) *
														100,
													{
														displayedUnit: '%',
														precision: 0
													}
												)}
											</strong>{' '}
											du coût habituel
										</span>
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

type ComparaisonTableProps = {
	rows: [Array<string>, ...Array<Line>]
}

type Line = Array<
	EvaluatedRule<DottedName> & {
		additionalText?: React.ReactNode
	}
>

function ComparaisonTable({ rows: [head, ...body] }: ComparaisonTableProps) {
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
								<option value={i} selected={i === currentColumnIndex} key={i}>
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

function ValueWithLink(rule: EvaluatedRule<DottedName>) {
	const { language } = useTranslation().i18n
	return (
		<RuleLink dottedName={rule.dottedName}>
			{formatValue(rule, {
				language,
				displayedUnit: '€',
				precision: 0
			})}
		</RuleLink>
	)
}

function RowLabel(target: EvaluatedRule) {
	return (
		<>
			{' '}
			<div
				css={`
					font-weight: bold;
				`}
			>
				{target.title}
			</div>
			<p className="ui__ notice">{target.summary}</p>
		</>
	)
}

const ResultTable = styled.table`
	width: 100%;
	border-collapse: collapse;

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
		padding: 0.8rem 1rem 0;
	}

	td:first-child {
		text-align: left;
		p {
			margin-top: 0.2rem;
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
	const { t } = useTranslation()

	return (
		<Markdown
			css={`
				margin-top: 2rem;
			`}
			source={t(
				'pages.simulateurs.chômage-partiel.explications seo',
				`
[👨‍💻 Intégrer ce simulateur sur votre site](/intégration/iframe?module=simulateur-chomage-partiel)

## Comment calculer l'indemnité d'activité partielle ?

L'indemnité d'activité partielle de base est fixée par la loi à **70% du brut**. Elle est proratisée en fonction du nombre d'heures chômées. Pour un salarié à 2300 € brut mensuel, qui travaille à 50% de son temps usuel, cela donne  **2300 € × 50% × 70% = 805 €**

A cette indemnité de base s'ajoute l'indemnité complémentaire pour les salaires proches du SMIC. Ce complément intervient lorsque le cumul de la rémunération et de l'indemnité de base est en dessous d'un SMIC net.

Ces indemnités sont prises en charge par l'employeur, qui sera ensuite remboursé en parti ou en totalité par l'Etat.

👉 [Voir le détail du calcul de l'indemnité](/documentation/contrat-salarié/activité-partielle/indemnités)


## Comment calculer la part remboursée par l'État ?

L'Etat prend en charge une partie de l'indemnité partielle pour les salaires allant jusqu'à **4,5 SMIC**, avec un minimum à 8,03€ par heures chômée.

Concrètement, cela abouti à une prise en charge à **100%** pour les salaires proches du SMIC. Celle-ci diminue progressivement jusqu'à se stabiliser à **93%** pour les salaires compris **entre 2000 € et 7000 €** (salaire correspondant à la limite de 4.5 SMIC).

👉 [Voir le détail du calcul du remboursement de l'indemnité](/documentation/contrat-salarié/activité-partielle/indemnisation-entreprise)

## Comment déclarer une activité partielle ?

Face à la crise du coronavirus, les modalités de passage en activité partielle
ont été allégées. L'employeur est autorisé a placer ses salariés en activité
partielle avant que la demande officielle ne soit déposée. Celui-ci dispose
ensuite d'un délai de **30 jours** pour se mettre en règle. Les
indemnités seront versées avec un effet rétro-actif débutant à la mise en place
du chômage partiel.

👉 [Effectuer la demande de chômage partiel](https://www.service-public.fr/professionnels-entreprises/vosdroits/R31001)

## Quelles sont les cotisations sociales à payer pour l'indemnité d'activité partielle ?

L'indemnité d'activité partielle est soumise à la CSG/CRDS et à une
contribution maladie dans certains cas. Pour en savoir plus, voir la page explicative sur [le site de l'URSSAF](https://www.urssaf.fr/portail/home/actualites/toute-lactualite-employeur/activite-partielle--nouveau-disp.html).


`
			)}
		/>
	)
}
