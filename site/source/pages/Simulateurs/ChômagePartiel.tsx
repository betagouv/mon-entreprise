import { DottedName } from 'modele-social'
import { formatValue } from 'publicodes'
import React, { useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import styled from 'styled-components'

import RuleLink from '@/components/RuleLink'
import Simulation, {
	SimulationGoal,
	SimulationGoals,
} from '@/components/Simulation'
import Warning from '@/components/ui/WarningBlock'
import { FromTop } from '@/components/ui/animate'
import { useEngine } from '@/components/utils/EngineContext'
import { Li, Ul } from '@/design-system/typography/list'

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
	const { t } = useTranslation()

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
	const net = 'salarié . rémunération . net . à payer avant impôt'
	const netHabituel = 'salarié . activité partielle . net habituel'
	const totalEntreprise = 'salarié . coût total employeur'
	const totalEntrepriseHabituel =
		'salarié . activité partielle . total employeur habituel'

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

	const captionText = (
		<Trans i18nKey="chomagePartiel.tableCaption">
			Tableau indiquant le salaire net et le coût pour l'employeur avec ou sans
			chômage partiel.
		</Trans>
	)

	return (
		<>
			<ResultTable className="ui__ mobile-version">
				<caption className="sr-only">{captionText}</caption>
				<thead>
					<tr>
						<th id="emptyTh1"></th>
						<th role="columnheader" scope="col">
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
							<th role="rowheader" scope="row">
								<RowLabel {...label} />
							</th>
							<td>
								<ValueWithLink {...line[currentColumnIndex]} />
							</td>
						</tr>
					))}
				</tbody>
			</ResultTable>
			<ResultTable>
				<caption className="sr-only">{captionText}</caption>
				<thead>
					<tr>
						{head.map((label, i) => (
							<th key={i} role="columnheader" scope="column">
								{label}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{body.map(([label, ...line], i) => (
						<tr key={i}>
							<th role="rowheader" scope="row">
								<RowLabel {...label} />
							</th>
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

	th {
		font-weight: initial;
	}

	&.ui__.mobile-version {
		display: none;
		@media (max-width: 660px) {
			display: table;
		}
		td,
		th {
			text-align: center;
		}
	}

	&:not(.mobile-version) {
		display: none;
		@media (min-width: 660px) {
			display: table;
		}

		td:nth-child(2),
		th:nth-child(2) {
			font-size: 1em;
			opacity: 0.8;
		}
		td,
		th {
			vertical-align: top;
			text-align: right;
		}
	}

	tbody tr {
		border-top: 1px solid rgba(0, 0, 0, 0.1);
	}

	td,
	th {
		padding: 0.8rem 1rem 0;
	}

	td:first-child,
	th:first-child {
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

	td:nth-child(3),
	th:nth-child(2),
	th:nth-child(3) {
		font-weight: bold;
		p {
			font-weight: initial;
		}
	}

	td:last-child,
	th:last-child {
		background: var(--lighterColor);
		color: inherit;
	}
`
