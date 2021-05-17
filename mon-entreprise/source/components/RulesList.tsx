import dynamic from 'next/dynamic'
import { Trans } from 'react-i18next'
import './RulesList.css'

const SearchBar = dynamic(() => import('Components/SearchBar'))
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
