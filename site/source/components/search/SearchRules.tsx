import algoliasearch from 'algoliasearch/lite'
import { H2 } from 'DesignSystem/typography/heading'
import { Trans } from 'react-i18next'
import { RulesInfiniteHits } from './RulesInfiniteHits'
import { SearchBox } from './SearchBox'
import { SearchRoot } from './SearchRoot'

const ALGOLIA_APP_ID = import.meta.env.VITE_ALGOLIA_APP_ID || ''
const ALGOLIA_SEARCH_KEY = import.meta.env.VITE_ALGOLIA_SEARCH_KEY || ''
const ALGOLIA_INDEX_PREFIX = import.meta.env.VITE_ALGOLIA_INDEX_PREFIX || ''

const searchClient = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_SEARCH_KEY)

export default function SearchRules() {
	return (
		<SearchRoot
			indexName={`${ALGOLIA_INDEX_PREFIX}rules`}
			searchClient={searchClient}
		>
			<SearchBox />
			<H2>
				<Trans>Règles de calculs</Trans>
			</H2>
			<RulesInfiniteHits />
		</SearchRoot>
	)
}
