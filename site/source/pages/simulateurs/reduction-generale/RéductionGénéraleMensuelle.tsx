import { DottedName } from 'modele-social'
import { formatValue, PublicodesExpression } from 'publicodes'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { styled } from 'styled-components'

import { ExplicableRule } from '@/components/conversation/Explicable'
import NumberInput from '@/components/conversation/NumberInput'
import { useEngine } from '@/components/utils/EngineContext'
import { SimpleRuleEvaluation } from '@/domaine/engine/SimpleRuleEvaluation'
import { Situation } from '@/domaine/Situation'
import { ajusteLaSituation } from '@/store/actions/actions'
import { situationSelector } from '@/store/selectors/simulationSelectors'

type MonthState = {
	salaireBrut: number
	réductionGénérale: number
}
type SalaireBrutInput = {
	unité: string
	valeur: number
}

export default function RéductionGénéraleMensuelle() {
	const engine = useEngine()
	const situation = useSelector(situationSelector)
	const situationRef = useRef(situation)
	const dispatch = useDispatch()
	const { t, i18n } = useTranslation()
	const language = i18n.language
	const unit = '€/mois'
	const displayedUnit = '€'
	const réductionGénéraleDottedName =
		'salarié . cotisations . exonérations . réduction générale' as DottedName
	const salaireBrutDottedName = 'salarié . contrat . salaire brut' as DottedName

	const [data, setData] = useState<MonthState[]>([])

	const evaluateRéductionGénérale = useCallback(
		(salaireBrut: number) => {
			const réductionGénérale = engine.evaluate({
				valeur: réductionGénéraleDottedName,
				unité: unit,
				contexte: {
					[salaireBrutDottedName]: salaireBrut,
				},
			})

			return réductionGénérale.nodeValue as number
		},
		[engine]
	)

	const initializeData = useCallback(() => {
		const salaireBrut =
			(engine.evaluate({
				valeur: salaireBrutDottedName,
				arrondi: 'oui',
				unité: unit,
			})?.nodeValue as number) || 0
		const réductionGénérale = evaluateRéductionGénérale(salaireBrut)

		const initialData = Array(12).fill({
			salaireBrut,
			réductionGénérale,
		})

		setData(initialData)
	}, [engine, evaluateRéductionGénérale, setData])

	useEffect(() => {
		if (data.length === 0) {
			initializeData()
		}
	}, [initializeData, data])

	useEffect(() => {
		const hasSituationSansSalaireChanged = (
			currentSituation: Situation,
			newSituation: Situation
		) => {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { [salaireBrutDottedName]: _, ...newSituationSansSalaire } =
				newSituation
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { [salaireBrutDottedName]: __, ...currentSituationSansSalaire } =
				currentSituation

			return (
				JSON.stringify(newSituationSansSalaire) !==
				JSON.stringify(currentSituationSansSalaire)
			)
		}

		if (hasSituationSansSalaireChanged(situationRef.current, situation)) {
			setData((previousData) =>
				previousData.map((item) => ({
					...item,
					réductionGénérale: evaluateRéductionGénérale(item.salaireBrut),
				}))
			)
		}

		situationRef.current = situation
	}, [situation, evaluateRéductionGénérale])

	const onSalaireChange = (month: number, salaireBrut: SalaireBrutInput) => {
		setData((previousData) => {
			const updatedData = [...previousData]
			updatedData[month] = {
				...updatedData[month],
				salaireBrut: salaireBrut.valeur,
				réductionGénérale: evaluateRéductionGénérale(salaireBrut.valeur),
			}
			const salaireBrutAnnuel = updatedData.reduce(
				(total: number, monthState: MonthState) =>
					total + monthState.salaireBrut,
				0
			)

			dispatch(
				ajusteLaSituation({
					[salaireBrutDottedName]: {
						valeur: salaireBrutAnnuel,
						unité: '€/an',
					} as PublicodesExpression,
				} as Record<DottedName, SimpleRuleEvaluation>)
			)

			return updatedData
		})
	}

	// TODO: enlever les 4 premières props après résolution de #3123
	const ruleInputProps = {
		dottedName: salaireBrutDottedName,
		suggestions: {},
		description: undefined,
		question: undefined,
		engine,
		'aria-labelledby': 'simu-update-explaining',
		formatOptions: {
			maximumFractionDigits: 0,
		},
		displayedUnit,
		unit: {
			numerators: ['€'],
			denominators: [],
		},
	}

	return (
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
				{data.length &&
					[
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
					].map((monthName, month) => (
						<tr key={monthName}>
							<th scope="row">{monthName}</th>
							<td>
								<NumberInput
									{...ruleInputProps}
									id={`${salaireBrutDottedName.replace(
										/\s|\./g,
										'_'
									)}-${monthName}`}
									aria-label={`${engine.getRule(salaireBrutDottedName)
										?.title} (${monthName})`}
									onChange={(salaireBrut?: PublicodesExpression) =>
										onSalaireChange(month, salaireBrut as SalaireBrutInput)
									}
									value={data[month].salaireBrut}
								/>
							</td>
							<td>
								{data[month].réductionGénérale
									? formatValue(
											{ nodeValue: data[month].réductionGénérale },
											{
												displayedUnit,
												language,
											}
									  )
									: formatValue(0, { displayedUnit, language })}
							</td>
						</tr>
					))}
			</tbody>
		</StyledTable>
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
