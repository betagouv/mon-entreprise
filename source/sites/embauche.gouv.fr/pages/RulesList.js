import { Component, React, T } from 'Components'
import SearchBar from 'Components/SearchBar'
import { connect } from 'react-redux'
import 'react-select/dist/react-select.css'
import { flatRulesSelector } from 'Selectors/analyseSelectors'
import './RulesList.css'

export default connect(state => ({
	flatRules: flatRulesSelector(state)
}))(
	class RulesList extends Component {
		render() {
			let { flatRules } = this.props
			return (
				<div id="RulesList" className="ui__ container">
					<h1>
						<T>Explorez notre base de règles</T>
					</h1>
					<SearchBar showDefaultList={true} rules={flatRules} />
				</div>
			)
		}
	}
)
