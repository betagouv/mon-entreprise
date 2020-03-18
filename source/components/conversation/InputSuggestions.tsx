import { toPairs } from 'ramda'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Unit } from '../../engine/units'

type InputSuggestionsProps = {
	suggestions: Record<string, number>
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
	const [suggestion, setSuggestion] = useState<number>()
	const { t } = useTranslation()
	if (!suggestions) return null

	return (
		<div css="display: flex; align-items: baseline; ">
			<small>Suggestions :</small>

			{toPairs(suggestions).map(([text, value]: [string, number]) => (
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
			))}
		</div>
	)
}
