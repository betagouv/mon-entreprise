import { DottedName } from 'modele-social'
import { formatValue, PublicodesExpression } from 'publicodes'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { styled } from 'styled-components'

import { ExplicableRule } from '@/components/conversation/Explicable'
import RuleInput from '@/components/conversation/RuleInput'
import { useEngine } from '@/components/utils/EngineContext'
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
	const { t, i18n } = useTranslation()
	const language = i18n.language
	const unit = '€/mois'
	const displayedUnit = '€'
	const réductionGénéraleDottedName =
		'salarié . cotisations . exonérations . réduction générale' as DottedName
	const salaireBrutDottedName = 'salarié . contrat . salaire brut' as DottedName

	const initialSalaireBrutEvaluation = useMemo(
		() =>
			engine.evaluate({
				valeur: salaireBrutDottedName,
				arrondi: 'oui',
				unité: unit,
			}),
		[engine]
	)

	const [data, setData] = useState<MonthState[]>(() => {
		const salaireInitial = initialSalaireBrutEvaluation?.nodeValue || 0

		return Array(12).fill({
			salaireBrut: salaireInitial,
			réductionGénérale: 0,
		}) as MonthState[]
	})

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

	// On utilise une référence à data dans useEffect pour éviter une boucle infinie
	const dataRef = useRef(data)
	useEffect(() => {
		const updatedData = dataRef.current.map((item) => ({
			...item,
			réductionGénérale: evaluateRéductionGénérale(item.salaireBrut),
		}))

		setData(updatedData)
	}, [situation, evaluateRéductionGénérale])

	const onSalaireChange = (month: number, salaireBrut: SalaireBrutInput) => {
		setData((previousData) => {
			const updatedData = [...previousData]
			updatedData[month] = {
				...updatedData[month],
				salaireBrut: salaireBrut.valeur,
				réductionGénérale: evaluateRéductionGénérale(salaireBrut.valeur),
			}

			return updatedData
		})
	}

	const ruleInputProps = {
		engine,
		modifiers: {
			unité: unit,
		},
		'aria-describedby': `${salaireBrutDottedName.replace(
			/\s|\./g,
			'_'
		)}-description`,
		'aria-labelledby': 'simu-update-explaining',
		showSuggestions: false,
		dottedName: salaireBrutDottedName,
		formatOptions: {
			maximumFractionDigits: 0,
		},
		displayedUnit,
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
				{[
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
							<RuleInput
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
