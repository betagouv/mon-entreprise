import { DottedName } from 'modele-social'
import { Evaluation, formatValue, PublicodesExpression } from 'publicodes'
import { useCallback, useReducer } from 'react'
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
	salaireBrut: undefined | PublicodesExpression
	réductionGénérale: undefined | Evaluation
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

export default function RéductionGénéraleMensuelle() {
	function reducer(
		state: State,
		action: {
			type: string
			month: Month
			salaireBrut: PublicodesExpression | undefined
			réductionGénérale: Evaluation | undefined
		}
	) {
		switch (action.type) {
			case 'MODIFIE_SALAIRE_BRUT':
				return {
					...state,
					[action.month]: {
						...state[action.month],
						salaireBrut: action.salaireBrut,
						réductionGénérale: action.réductionGénérale,
					},
				}
			default:
				throw new Error()
		}
	}
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
	const initialSalaireBrutEvaluation = engine.evaluate({
		valeur: salaireBrutDottedName,
		arrondi: 'oui',
		unité: unit,
	})
	const getRéductionGénérale = useCallback(
		(salaireBrut?: PublicodesExpression) => {
			return engine.evaluate({
				valeur: réductionGénéraleDottedName,
				unité: unit,
				contexte: {
					[salaireBrutDottedName]: salaireBrut,
				},
			})
		},
		[engine]
	)
	const initialRéductionGénérale = getRéductionGénérale(initialSalaireBrutEvaluation)
	const initialState = months.reduce(function (acc, month: Month, key: number) {
		return {
			...acc,
			[month]: {
				month,
				nbMoisCumulé: ++key,
				salaireBrut: initialSalaireBrutEvaluation,
				réductionGénérale: initialRéductionGénérale.nodeValue,
			},
		}
	}, {}) as State

	const [state, dispatch] = useReducer(reducer, initialState)

	const { t } = useTranslation()

	const onSalaireBrutChange = useCallback(
		(month: Month, salaireBrut?: PublicodesExpression) => {
			const réductionGénérale = getRéductionGénérale(salaireBrut)

			dispatch({
				type: 'MODIFIE_SALAIRE_BRUT',
				month,
				salaireBrut,
				réductionGénérale: réductionGénérale.nodeValue,
			})
		},
		[getRéductionGénérale, dispatch]
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
		missing: salaireBrutDottedName in initialSalaireBrutEvaluation.missingVariables,
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
										onSalaireBrutChange(month, salaireBrut)
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
