import SearchBar from 'Components/SearchBar'
import { Trans } from 'react-i18next'
import './RulesList.css'

export default function RulesList() {
	return (
		<div id="RulesList" className="ui__ container">
			<h1>
				<Trans>Explorez notre documentation</Trans>
			</h1>
			<SearchBar />
		</div>
	)
}
