import SearchBar from 'Components/SearchBar'
import React from 'react'
import { Trans } from 'react-i18next'
import { useSelector } from 'react-redux'
import { flatRulesSelector } from 'Selectors/analyseSelectors'
import './RulesList.css'

export default function RulesList() {
	const flatRules = useSelector(flatRulesSelector)
	return (
		<div id="RulesList" className="ui__ container">
			<h1>
				<Trans>Explorez notre documentation</Trans>
			</h1>
			<SearchBar showDefaultList={true} rules={flatRules} />
		</div>
	)
}
