import RuleLink from 'Components/RuleLink'
import Simulation from 'Components/Simulation'
import Animate from 'Components/ui/animate'
import Warning from 'Components/ui/WarningBlock'
import { IsEmbeddedContext } from 'Components/utils/embeddedContext'
import { useEngine } from 'Components/utils/EngineContext'
import { DottedName } from 'modele-social'
import { formatValue } from 'publicodes'
import React, { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

declare global {
	interface Window {
		STONLY_WID: string
		StonlyWidget?: {
			open: () => void
			close: () => void
			toggle: () => void
			launcherShow: () => void
			launcherHide: () => void
			startURLWatcher: () => void
			stopURLWatcher: () => void
		}
	}
}

export default function ChômagePartiel() {
	const inIframe = useContext(IsEmbeddedContext)
	useEffect(() => {
		if (inIframe) {
			return
		}
		if (!window.StonlyWidget) {
			const script = document.createElement('script')
			window.STONLY_WID = '0128ae02-6780-11ea-ac13-0a4250848ba4'
			script.src = 'https://stonly.com/js/widget/stonly-widget.js'
			script.async = true
			document.body.appendChild(script)
		} else {
			window.StonlyWidget?.launcherShow()
		}
		return () => {
			window.StonlyWidget?.stopURLWatcher()
			window.StonlyWidget?.launcherHide()
		}
	}, [inIframe])
	return (
		<>
			<Warning localStorageKey="covid19">
				<ul>
					<li>
						Ce simulateur ne prend pas en compte les rémunérations brut définies
						sur 39h hebdomadaires.
					</li>
				</ul>
			</Warning>
			<Simulation
				results={<ExplanationSection />}
				customEndMessages={
					<span className="ui__ notice">Voir les résultats au-dessus</span>
				}
				showPeriodSwitch={false}
			/>
		</>
	)
}

function ExplanationSection() {
	const {
		i18n: { language },
		t,
	} = useTranslation()

	const engine = useEngine()
	const net = 'contrat salarié . rémunération . net'
	const netHabituel = 'chômage partiel . revenu net habituel'
	const totalEntreprise = 'contrat salarié . prix du travail'
	const totalEntrepriseHabituel = 'chômage partiel . coût employeur habituel'

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
								{ dottedName: net },
								{ dottedName: netHabituel },
								{
									dottedName: net,
									additionalText: language === 'fr' && (
										<span data-test-id="comparaison-net">
											Soit{' '}
											<strong>
												{formatValue(
													engine.evaluate({
														valeur: `${net} / ${netHabituel}`,
														unité: '%',
														arrondi: 'oui',
													})
												)}
											</strong>{' '}
											du revenu net
										</span>
									),
								},
							],
							[
								{ dottedName: totalEntreprise },
								{ dottedName: totalEntrepriseHabituel },
								{
									dottedName: totalEntreprise,
									additionalText: language === 'fr' && (
										<span data-test-id="comparaison-total">
											Soit{' '}
											<strong>
												{formatValue(
													engine.evaluate({
														valeur: `${totalEntreprise} / ${totalEntrepriseHabituel}`,
														unité: '%',
														arrondi: 'oui',
													})
												)}
											</strong>{' '}
											du coût habituel
										</span>
									),
								},
							],
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

type Line = Array<{
	dottedName: DottedName
	additionalText?: React.ReactNode
}>

function ComparaisonTable({ rows: [head, ...body] }: ComparaisonTableProps) {
	const columns = head.filter((x) => x !== '')
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
							onChange={(evt) =>
								setCurrentColumnIndex(Number(evt.target.value))
							}
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

function ValueWithLink({ dottedName }: { dottedName: DottedName }) {
	const { language } = useTranslation().i18n
	const engine = useEngine()
	return (
		<RuleLink dottedName={dottedName}>
			{formatValue(engine.evaluate(dottedName), {
				language,
				displayedUnit: '€',
				precision: 0,
			})}
		</RuleLink>
	)
}

function RowLabel({ dottedName }: { dottedName: DottedName }) {
	const target = useEngine().getRule(dottedName)
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
			<p className="ui__ notice">{target.rawNode.résumé}</p>
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
		border-top: 1px solid hsla(0, 0%, 0%, 0.098);
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
