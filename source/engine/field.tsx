import FormattedInput from 'cleave.js/react'
import { RadioLabel } from 'Components/conversation/Question'
import ToggleSwitch from 'Components/ui/ToggleSwitch'
import { binaryOptionChoices, buildVariantTree } from 'Engine/getInputComponent'
import React, { useCallback, useState } from 'react'
import NumberFormat from 'react-number-format'
import { useSelector } from 'react-redux'
import { RootState } from 'Reducers/rootReducer'
import {
	flatRulesSelector,
	ruleAnalysisSelector,
	situationSelector
} from 'Selectors/analyseSelectors'
import { DottedName } from 'Types/rule'
import { debounce } from '../utils'
import { dateRegexp } from './date'

type FieldProps = {
	dottedName: DottedName
	useSwitch?: boolean
	onChange: (newValue: any) => void
}

export function Field({ dottedName, useSwitch = false, onChange }: FieldProps) {
	const situation = useSelector(situationSelector)
	const [value, setValue] = useState(situation[dottedName])
	const onChangeWithDebounce = useCallback(debounce(600, onChange), [])
	const analysis = useSelector((state: RootState) => {
		return ruleAnalysisSelector(state, { dottedName })
	})

	return analysis.unit !== undefined ? (
		<NumberFormat
			autoFocus
			id={'step-' + dottedName}
			thousandSeparator={' '}
			suffix=" €"
			allowEmptyFormatting={true}
			onValueChange={({ floatValue }) => {
				setValue(floatValue)
				onChangeWithDebounce(floatValue || 0)
			}}
			value={value}
			autoComplete="off"
			className="targetInput"
			css={`
				/* color: white; */
				/* border-color: white; */
				/* padding: 10px; */
			`}
		/>
	) : analysis.type === 'date' ? (
		<FormattedInput
			autoFocus
			id={'step-' + dottedName}
			placeholder="JJ/MM/AAAA"
			options={{
				date: true,
				delimiter: '/',
				datePattern: ['d', 'm', 'Y']
			}}
			onChange={({ target: { value } }) => {
				if (value.match(dateRegexp)) {
					onChange(value)
				}
			}}
			value={value}
			autoComplete="off"
		/>
	) : analysis.formule?.explanation?.['une possibilité'] === 'oui' ? (
		<UnionOption dottedName={dottedName} onChange={onChange} />
	) : useSwitch ? (
		<ToggleSwitch
			id={`step-${dottedName}`}
			defaultChecked={value}
			onChange={evt => onChange(evt.currentTarget.checked)}
		/>
	) : (
		<BinaryOption onChange={onChange} value={situation[dottedName]} />
	)
}

function BinaryOption({ onChange, value: currentValue }) {
	return (
		<>
			{binaryOptionChoices.map(({ label, value }) => (
				<RadioLabel key={label} {...{ value, currentValue, label, onChange }} />
			))}
		</>
	)
}

function UnionOption({ dottedName, onChange }) {
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
