import React, { Component } from 'react'
import { rules, encodeRuleName } from 'Engine/rules.js'
import { Link } from 'react-router-dom'
import './RulesList.css'
import './Pages.css'
import { capitalise0 } from '../../utils'
import Select from 'react-select'
import 'react-select/dist/react-select.css'
import Fuse from 'fuse.js'
import { Redirect } from 'react-router-dom'

export default class RulesList extends Component {
	render() {
		return (
			<div id="RulesList" className="page">
				<h1>Explorez notre base de règles</h1>
				<SearchBar rules={rules} />
			</div>
		)
	}
}

class SearchBar extends React.Component {
	componentWillMount() {
		var options = {
			keys: [
				{
					name: 'title',
					weight: 0.5
				},
				{
					name: 'espace',
					weight: 0.3
				},
				{
					name: 'description',
					weight: 0.2
				}
			]
		}
		this.fuse = new Fuse(rules, options)
	}
	state = {
		selectedOption: null
	}
	handleChange = selectedOption => {
		this.setState({ selectedOption })
	}

	filterOptions = (options, filter) => this.fuse.search(filter)
	render() {
		let { selectedOption } = this.state

		if (selectedOption != null)
			return <Redirect to={'règle/' + selectedOption.dottedName} />
		return (
			<Select
				name="form-field-name"
				value={selectedOption && selectedOption.dottedName}
				onChange={this.handleChange}
				valueKey="dottedName"
				labelKey="title"
				filterOptions={this.filterOptions}
			/>
		)
	}
}

// <ul>
// 	{rules.map(rule => (
// 		<li key={rule.name}>
// 			<Link to={'/règle/' + encodeRuleName(rule.name)}>
// 				{capitalise0(rule.name)}
// 			</Link>
// 		</li>
// 	))}
// </ul>
