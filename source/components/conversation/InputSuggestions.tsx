import { toPairs } from 'ramda'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { defaultUnitsSelector } from 'Selectors/analyseSelectors'
import { convertUnit, parseUnit } from '../../engine/units'

export default function InputSuggestions({
	suggestions,
	onSecondClick = x => x,
	onFirstClick,
	unit
}) {
	const [suggestion, setSuggestion] = useState(null)
	const { t } = useTranslation()
	const defaultUnit = parseUnit(useSelector(defaultUnitsSelector)[0])
	if (!suggestions) return null

	return (
		<div css="display: flex; align-items: baseline; justify-content: flex-end;">
			<small>Suggestions :</small>

			{toPairs(suggestions).map(([text, value]: [string, number]) => {
				value = unit ? convertUnit(unit, defaultUnit, value) : value
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
