import algoliasearch from 'algoliasearch/lite'
import { Spacing } from 'DesignSystem/layout'
import { Configure, Index } from 'react-instantsearch-dom'
import { RulesInfiniteHits } from './RulesInfiniteHits'
import { SearchBox } from './SearchBox'
import { SearchRoot } from './SearchRoot'
import { SimulatorHits } from './SimulatorHits'
const ALGOLIA_APP_ID = process.env.ALGOLIA_APP_ID || ''
const ALGOLIA_SEARCH_KEY = process.env.ALGOLIA_SEARCH_KEY || ''
const ALGOLIA_INDEX_PREFIX = process.env.ALGOLIA_INDEX_PREFIX || ''

const searchClient = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_SEARCH_KEY)

export default function SearchRulesAndSimulators() {
	return (
		<SearchRoot
			indexName={`${ALGOLIA_INDEX_PREFIX}rules`}
			searchClient={searchClient}
		>
			<SearchBox />

			<Index indexName={`${ALGOLIA_INDEX_PREFIX}simulateurs`}>
				<Configure hitsPerPage={6} />
				<SimulatorHits />
			</Index>

			<Index indexName={`${ALGOLIA_INDEX_PREFIX}rules`}>
				<RulesInfiniteHits />
			</Index>
			<Spacing lg />
		</SearchRoot>
	)
}
