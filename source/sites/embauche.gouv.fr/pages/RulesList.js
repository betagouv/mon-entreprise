import SearchBar from 'Components/SearchBar'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import 'react-select/dist/react-select.css'
import { flatRulesSelector } from 'Selectors/analyseSelectors'
import './RulesList.css'

@connect(state => ({
	flatRules: flatRulesSelector(state)
}))
export default class RulesList extends Component {
	render() {
		let { flatRules } = this.props
		return (
			<div id="RulesList" className="ui__ container">
				<h1>Explorez notre base de règles</h1>
				<SearchBar
					showDefaultList={true}
					rules={flatRules}
					rulePagesBasePath="règle"
				/>
			</div>
		)
	}
}
