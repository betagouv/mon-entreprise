import React, { Component } from 'react'
import ReactSelect from 'react-select'
import 'react-select/dist/react-select.css'
import { FormDecorator } from '../FormDecorator'
import './Select.css'
import SelectOption from './SelectOption.js'

class ReactSelectWrapper extends Component {
	render() {
		let {
			value,
			onBlur,
			onChange,
			submit,
			options,
			submitOnChange = option => {
				option.text = option['Taux net'].replace(',', '.')
				onChange(option.text)
				submit()
			},
			selectValue = value && value['Code risque']
			// but ReactSelect obviously needs a unique identifier
		} = this.props

		if (!options) return null

		return (
			// For redux-form integration, checkout https://github.com/erikras/redux-form/issues/82#issuecomment-143164199
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
}

class Select extends Component {
	state = {
		options: null
	}

	render() {
		let { input, submit } = this.props
		return (
			<div className="select-answer">
				<ReactSelectWrapper
					{...input}
					options={this.state.options}
					submit={submit}
				/>
			</div>
		)
	}

	componentDidMount() {
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
			.then(json => this.setState({ options: json }))
			.catch(
				error =>
					console.log('Erreur dans la récupération des codes risques', error) // eslint-disable-line no-console
			)
	}
}

export default FormDecorator('select')(Select)
