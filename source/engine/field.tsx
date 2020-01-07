import { buildVariantTree } from 'Engine/InputComponent'
import React from 'react'
import { useSelector } from 'react-redux'
import { flatRulesSelector } from 'Selectors/analyseSelectors'

export function UnionOption({ dottedName, onChange }) {
	const flatRules = useSelector(flatRulesSelector)
	const variants = buildVariantTree(flatRules, dottedName).children

	return (
		<select
			onChange={evt => {
				onChange(evt.target.value)
			}}
		>
			<option></option>
			{variants.map(({ name }) => (
				<option>{name}</option>
			))}
		</select>
	)
}
