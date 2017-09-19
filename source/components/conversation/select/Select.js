import React, { Component } from 'react'
import {FormDecorator} from '../FormDecorator'
import VirtualizedSelect from 'react-virtualized-select'
import createFilterOptions from 'react-select-fast-filter-options'

import 'react-select/dist/react-select.css'
import './Select.css'


@FormDecorator('select')
export default class Select extends Component {
	state = {
		data: null,
		filterOptions: null
	}
	componentDidMount(){
		import(/* webpackChunkName: "communescsv" */ 'Règles/communes.csv')
			.then(module => this.setState({
				data: module,
				filterOptions: createFilterOptions({ options: module, labelKey: 'Nom_commune', valueKey: 'Nom_commune' })
			}))
			.catch(error => 'An error occurred while loading the component')
	}
	render() {
		let {
			input: {
				onChange,
			},
			stepProps: {submit, suggestions}
		} = this.props,
			submitOnChange =
				option => {
					console.log('option', option)
					onChange(option.Nom_commune)
					submit()
				}

		if (!this.state.data)
			return <div>Nous reçevons les données... </div>

		return (
			<div className="select-answer commune">
				<VirtualizedSelect
					options={this.state.data}
					onChange={submitOnChange}
					labelKey="Nom_commune"
					valueKey="Nom_commune"
					placeholder="Entrez le nom de commune"
					noResultsText="Nous n'avons trouvé aucune commune"
					filterOptions={this.state.filterOptions}
				/>
			</div>
		)
	}
}
