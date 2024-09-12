import { DottedName } from 'modele-social'
import { Evaluation, formatValue, PublicodesExpression } from 'publicodes'
import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { ExplicableRule } from '@/components/conversation/Explicable'
import RuleInput from '@/components/conversation/RuleInput'
import { useEngine } from '@/components/utils/EngineContext'

type State = {
	[month in Month]: MonthState
}
type MonthState = {
	month: Month
	nbMoisCumulé: number
	salaireBrut: number
	réductionGénérale: number
}
type Month =
	| 'janvier'
	| 'février'
	| 'mars'
	| 'avril'
	| 'mai'
	| 'juin'
	| 'juillet'
	| 'août'
	| 'septembre'
	| 'octobre'
	| 'novembre'
	| 'décembre'
type SalaireBrutInput = {
	unité: string
	valeur: number
}

export default function RéductionGénéraleMensuelle() {
	const months: Month[] = [
		'janvier',
		'février',
		'mars',
		'avril',
		'mai',
		'juin',
		'juillet',
		'août',
		'septembre',
		'octobre',
		'novembre',
		'décembre',
	]
	const engine = useEngine()
	const unit = '€/mois'
	const displayedUnit = '€'
	const réductionGénéraleDottedName =
		'salarié . cotisations . exonérations . réduction générale' as DottedName
	const salaireBrutDottedName = 'salarié . contrat . salaire brut' as DottedName
	const { t } = useTranslation()

	const getRéductionGénérale = useCallback(
		(salaireBrut?: number) => {
			return salaireBrut
				? engine.evaluate({
						valeur: réductionGénéraleDottedName,
						unité: unit,
						contexte: {
							[salaireBrutDottedName]: salaireBrut,
						},
				  })
				: undefined
		},
		[engine]
	)

	const initialSalaireBrutEvaluation = useMemo(
		() =>
			engine.evaluate({
				valeur: salaireBrutDottedName,
				arrondi: 'oui',
				unité: unit,
			}),
		[engine]
	)
	const initialRéductionGénérale = getRéductionGénérale(
		initialSalaireBrutEvaluation?.nodeValue as number
	)
	const initialState = months.reduce(
		(acc, month, key) => ({
			...acc,
			[month]: {
				month,
				nbMoisCumulé: key + 1,
				salaireBrut: initialSalaireBrutEvaluation?.nodeValue,
				réductionGénérale: initialRéductionGénérale?.nodeValue,
			},
		}),
		{}
	) as State

	const [state, setState] = useState(initialState)

	const updateSalaireBrut = (
		month: Month,
		salaireBrut: Evaluation,
		réductionGénérale: Evaluation
	) => {
		setState((prevState) => ({
			...prevState,
			[month]: {
				...prevState[month],
				salaireBrut,
				réductionGénérale,
			},
		}))
	}

	const onSalaireBrutChange = useCallback(
		(month: Month, salaireBrut: SalaireBrutInput) => {
			const réductionGénérale = getRéductionGénérale(salaireBrut.valeur)
			updateSalaireBrut(month, salaireBrut.valeur, réductionGénérale?.nodeValue)
		},
		[getRéductionGénérale]
	)

	const ruleInputProps = {
		engine,
		modifiers: {
			unité: unit,
		},
		'aria-label': engine.getRule(salaireBrutDottedName)?.title,
		'aria-describedby': `${salaireBrutDottedName.replace(
			/\s|\./g,
			'_'
		)}-description`,
		'aria-labelledby': 'simu-update-explaining',
		showSuggestions: false,
		dottedName: salaireBrutDottedName,
		missing:
			initialSalaireBrutEvaluation &&
			salaireBrutDottedName in initialSalaireBrutEvaluation.missingVariables,
		formatOptions: {
			maximumFractionDigits: 0,
		},
		displayedUnit,
	}

	return (
		<>
			<StyledTable style={{ width: '100%' }}>
				<caption>{t('Réduction générale mois par mois :')}</caption>
				<thead>
					<tr>
						<th scope="col">{t('Mois')}</th>
						<th scope="col">
							{t('Salaire brut')}
							<ExplicableRule dottedName={salaireBrutDottedName} />
						</th>
						<th scope="col">
							{t('Réduction générale')}
							<ExplicableRule dottedName={réductionGénéraleDottedName} light />
						</th>
					</tr>
				</thead>
				<tbody>
					{months.map((month) => (
						<tr key={month}>
							<th scope="row">{month}</th>
							<td>
								<RuleInput
									{...ruleInputProps}
									onChange={(salaireBrut?: PublicodesExpression) =>
										onSalaireBrutChange(month, salaireBrut as SalaireBrutInput)
									}
								/>
							</td>
							<td>
								{state[month].réductionGénérale
									? formatValue(
											{ nodeValue: state[month].réductionGénérale },
											{
												displayedUnit,
											}
									  )
									: formatValue(0, { displayedUnit })}
							</td>
						</tr>
					))}
				</tbody>
			</StyledTable>
		</>
	)
}

const StyledTable = styled.table`
	text-align: left;
	width: 100%;
	color: ${({ theme }) => theme.colors.bases.primary[100]};
	font-family: ${({ theme }) => theme.fonts.main};

	caption {
		text-align: left;
		margin: ${({ theme }) => `${theme.spacings.sm} 0 `};
	}

	th {
		padding: ${({ theme }) => `${theme.spacings.xs} 0 ${theme.spacings.lg} 0`};
	}

	tbody tr td:not(:first-of-type) {
		padding: ${({ theme }) =>
			`${theme.spacings.xs} ${theme.spacings.xxs} ${theme.spacings.lg} ${theme.spacings.xxs}`};
	}

	tbody tr th {
		text-transform: capitalize;
		font-weight: normal;
	}
`
