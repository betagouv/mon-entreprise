import RuleLink from '@/components/RuleLink'
import Simulation, {
	SimulationGoal,
	SimulationGoals,
} from '@/components/Simulation'
import { FromTop } from '@/components/ui/animate'
import Warning from '@/components/ui/WarningBlock'
import { useIsEmbedded } from '@/components/utils/embeddedContext'
import { useEngine } from '@/components/utils/EngineContext'
import { Li, Ul } from '@/design-system/typography/list'
import { DottedName } from 'modele-social'
import { formatValue } from 'publicodes'
import React, { useEffect, useState } from 'react'
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
	const inIframe = useIsEmbedded()
	const { t } = useTranslation()
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
				<Ul>
					<Li>
						Ce simulateur ne prend pas en compte les rémunérations brut définies
						sur 39h hebdomadaires.
					</Li>
				</Ul>
			</Warning>
			<Simulation
				results={<ExplanationSection />}
				customEndMessages={
					<span className="ui__ notice">Voir les résultats au-dessus</span>
				}
			>
				<SimulationGoals legend="Salaire brut avant chômage partiel">
					<SimulationGoal
						label={t('Salaire brut mensuel')}
						dottedName="salarié . contrat . salaire brut"
					/>
				</SimulationGoals>
			</Simulation>
		</>
	)
}

function ExplanationSection() {
	const {
		i18n: { language },
		t,
	} = useTranslation()

	const engine = useEngine()
	const net = 'salarié . rémunération . net'
	const netHabituel = 'chômage partiel . revenu net habituel'
	const totalEntreprise = 'salarié . prix du travail'
	const totalEntrepriseHabituel = 'chômage partiel . coût employeur habituel'

	return (
		<FromTop>
			<div
				className="ui__ light card"
				css={`
					overflow: hidden;
					margin: 1rem 0;
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
		</FromTop>
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
				<thead>
					<tr>
						<th></th>
						<th>
							<select
								onChange={(evt) =>
									setCurrentColumnIndex(Number(evt.target.value))
								}
								value={currentColumnIndex}
							>
								{columns.map((name, i) => (
									<option value={i} key={i}>
										{name}
									</option>
								))}
							</select>
						</th>
					</tr>
				</thead>
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
				<tbody>
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
				</tbody>
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
	font-family: ${({ theme }) => theme.fonts.main};
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
