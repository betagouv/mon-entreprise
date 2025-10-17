import { formatValue } from 'publicodes'
import { useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import RuleTitleWithRésumé from '@/components/EngineValue/RuleTitleWithRésumé'
import Value from '@/components/EngineValue/Value'
import { FromTop } from '@/components/ui/animate'
import { Strong } from '@/design-system'
import { useEngine } from '@/hooks/useEngine'
import { catchDivideByZeroError } from '@/utils/publicodes/publicodes'

const net = 'salarié . rémunération . net . à payer avant impôt'
const netHabituel = 'salarié . activité partielle . net habituel'
const totalEntreprise = 'salarié . coût total employeur'
const totalEntrepriseHabituel =
	'salarié . activité partielle . total employeur habituel'

const LabelNet = () => <RuleTitleWithRésumé dottedName={net} />
const ValueNet = () => (
	<Value expression={net} displayedUnit="€" precision={0} />
)
const ValueNetHabituel = () => (
	<Value expression={netHabituel} displayedUnit="€" precision={0} />
)
const LabelTotal = () => <RuleTitleWithRésumé dottedName={totalEntreprise} />
const ValueTotal = () => (
	<Value expression={totalEntreprise} displayedUnit="€" precision={0} />
)
const ValueTotalHabituel = () => (
	<Value expression={totalEntrepriseHabituel} displayedUnit="€" precision={0} />
)

export default function ComparaisonTable() {
	const { t } = useTranslation()

	const engine = useEngine()

	const comparaisonNet = formatValue(
		catchDivideByZeroError(() =>
			engine.evaluate({
				valeur: `${net} / ${netHabituel}`,
				unité: '%',
				arrondi: 'oui',
			})
		)
	) as number
	const comparaisonTotal = formatValue(
		catchDivideByZeroError(() =>
			engine.evaluate({
				valeur: `${totalEntreprise} / ${totalEntrepriseHabituel}`,
				unité: '%',
				arrondi: 'oui',
			})
		)
	) as number

	const [avecActivitéPartielle, setAvecActivitéPartielle] = useState(1)

	const caption = t(
		'pages.simulateurs.activité-partielle.comparaison.caption',
		"Tableau indiquant le salaire net et le coût pour l'employeur avec ou sans activité partielle."
	)
	const headerHabituellement = t(
		'pages.simulateurs.activité-partielle.comparaison.habituellement',
		'Habituellement'
	)
	const headerActivitéPartielle = t(
		'pages.simulateurs.activité-partielle.comparaison.activité-partielle',
		'Avec activité partielle'
	)

	return (
		<FromTop>
			<TableContainer>
				<ResultTable className="mobile-version">
					<caption className="sr-only">{caption}</caption>
					<thead>
						<tr>
							<th></th>
							<th scope="col">
								<select
									onChange={(evt) =>
										setAvecActivitéPartielle(Number(evt.target.value))
									}
									value={avecActivitéPartielle}
								>
									<option value={0}>{headerHabituellement}</option>
									<option value={1}>{headerActivitéPartielle}</option>
								</select>
							</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<th scope="row">
								<LabelNet />
							</th>
							<td>
								{avecActivitéPartielle ? <ValueNet /> : <ValueNetHabituel />}
							</td>
						</tr>
						<tr>
							<th scope="row">
								<LabelTotal />
							</th>
							<td>
								{avecActivitéPartielle ? (
									<ValueTotal />
								) : (
									<ValueTotalHabituel />
								)}
							</td>
						</tr>
					</tbody>
				</ResultTable>
				<ResultTable>
					<caption className="sr-only">{caption}</caption>
					<thead>
						<tr>
							<th></th>
							<th scope="col">{headerHabituellement}</th>
							<th scope="col">{headerActivitéPartielle}</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<th scope="row">
								<LabelNet />
							</th>
							<td>
								<ValueNetHabituel />
							</td>
							<td>
								<ValueNet />
								<RightAlignedParagraph data-test-id="comparaison-net">
									<Trans i18nKey="pages.simulateurs.activité-partielle.comparaison.net">
										Soit <Strong>{{ comparaisonNet }}</Strong> du revenu net
									</Trans>
								</RightAlignedParagraph>
							</td>
						</tr>
						<tr>
							<th scope="row">
								<LabelTotal />
							</th>
							<td>
								<ValueTotalHabituel />
							</td>
							<td>
								<ValueTotal />
								<RightAlignedParagraph>
									<Trans i18nKey="pages.simulateurs.activité-partielle.comparaison.total">
										Soit <Strong>{{ comparaisonTotal }}</Strong> du coût
										habituel
									</Trans>
								</RightAlignedParagraph>
							</td>
						</tr>
					</tbody>
				</ResultTable>
			</TableContainer>
		</FromTop>
	)
}

const TableContainer = styled.div`
	overflow: hidden;
	margin: ${({ theme }) => theme.spacings.md} 0;
`

const ResultTable = styled.table`
	font-family: ${({ theme }) => theme.fonts.main};
	width: 100%;
	border-collapse: collapse;

	th {
		font-weight: initial;
	}

	&.mobile-version {
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

const RightAlignedParagraph = styled.p`
	text-align: right;
`
