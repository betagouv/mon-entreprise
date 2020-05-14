import SearchBar from 'Components/SearchBar'
import React, { useContext } from 'react'
import { Trans } from 'react-i18next'
import { useSelector } from 'react-redux'
import './RulesList.css'
import { EngineContext } from 'Components/utils/EngineContext'

export default function RulesList() {
	const rules = useContext(EngineContext).getParsedRules()
	return (
		<div id="RulesList" className="ui__ container">
			<h1>
				<Trans>Explorez notre documentation</Trans>
			</h1>
			<SearchBar showDefaultList={true} rules={rules} />
		</div>
	)
}
