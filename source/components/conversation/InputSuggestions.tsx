import { Rule } from 'Engine/types'
import { toPairs } from 'ramda'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { defaultUnitSelector } from 'Selectors/analyseSelectors'
import { convertUnit, parseUnit, Unit } from '../../engine/units'

type InputSuggestionsProps = {
	suggestions?: Rule['suggestions']
	onFirstClick: (val: number | string) => void
	onSecondClick?: (val: number | string) => void
	unit?: Unit
}

export default function InputSuggestions({
	suggestions,
	onSecondClick = x => x,
	onFirstClick,
	unit
}: InputSuggestionsProps) {
	const [suggestion, setSuggestion] = useState<string | number>()
	const { t } = useTranslation()
	const defaultUnit = parseUnit(useSelector(defaultUnitSelector) ?? '')
	if (!suggestions) return null

	return (
		<div css="display: flex; align-items: baseline; ">
			<small>Suggestions :</small>

			{toPairs(suggestions).map(([text, value]: [string, string | number]) => {
				value =
					unit && typeof value === 'number'
						? convertUnit(unit, defaultUnit, value)
						: value
				return (
					<button
						className="ui__ link-button"
						key={value}
						css="margin: 0 0.4rem !important"
						onClick={() => {
							onFirstClick(value)
							if (suggestion !== value) setSuggestion(value)
							else onSecondClick && onSecondClick(value)
						}}
						title={t('cliquez pour insérer cette suggestion')}
					>
						{text}
					</button>
				)
			})}
		</div>
	)
}
