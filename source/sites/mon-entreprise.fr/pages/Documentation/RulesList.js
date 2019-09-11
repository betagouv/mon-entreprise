import { React, T } from 'Components'
import SearchBar from 'Components/SearchBar'
import { connect } from 'react-redux'
import 'react-select/dist/react-select.css'
import { flatRulesSelector } from 'Selectors/analyseSelectors'
import './RulesList.css'

export default connect(state => ({
	flatRules: flatRulesSelector(state)
}))(function RulesList({ flatRules }) {
	return (
		<div id="RulesList" className="ui__ container">
			<h1>
				<T>Explorez notre documentation</T>
			</h1>
			<SearchBar showDefaultList={true} rules={flatRules} />
		</div>
	)
})
