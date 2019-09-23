import React, { useEffect, useState } from 'react'
import ReactSelect from 'react-select'
import 'react-select/dist/react-select.css'
import { FormDecorator } from '../FormDecorator'
import './Select.css'
import SelectOption from './SelectOption.js'

function ReactSelectWrapper({
	value,
	onBlur,
	setFormValue,
	submit,
	options,
	submitOnChange = option => {
		option.text = +option['Taux net'].replace(',', '.') / 100
		setFormValue(option.text)
		submit()
	},
	selectValue = value?.['Code risque']
}) {
	if (!options) return null

	return (
		<ReactSelect
			options={options}
			onChange={submitOnChange}
			labelKey="Nature du risque"
			valueKey="Code risque"
			placeholder="Tapez des mots ou déroulez la liste complète"
			optionRenderer={SelectOption}
			valueRenderer={value => value['Taux net']}
			clearable={false}
			value={selectValue}
			onBlur={() => onBlur(value)}
		/>
	)
}

export default FormDecorator('select')(function Select(props) {
	const [options, setOptions] = useState(null)
	useEffect(() => {
		fetch(
			'https://raw.githubusercontent.com/sgmap/taux-collectifs-cotisation-atmp/master/taux-2018.json'
		)
			.then(response => {
				if (!response.ok) {
					let error = new Error(response.statusText)
					error.response = response
					throw error
				}
				return response.json()
			})
			.then(json => setOptions(json))
			.catch(
				error =>
					console.log('Erreur dans la récupération des codes risques', error) // eslint-disable-line no-console
			)
	}, [])

	return (
		<div className="select-answer">
			<ReactSelectWrapper {...props} options={options} />
		</div>
	)
})
