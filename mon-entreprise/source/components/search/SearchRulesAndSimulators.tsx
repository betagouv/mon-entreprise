import algoliasearch from 'algoliasearch/lite'
import { SearchField } from 'DesignSystem/field'
import { Spacing } from 'DesignSystem/layout'
import 'instantsearch.css/themes/satellite.css'
import { useTranslation } from 'react-i18next'
import {
	Configure,
	connectSearchBox,
	Index,
	InstantSearch,
} from 'react-instantsearch-dom'
import { RulesInfiniteHits } from './RulesInfiniteHits'
import './SearchRulesAndSimulators.css'
import { SimulatorHits } from './SimulatorHits'

const ALGOLIA_APP_ID = process.env.ALGOLIA_APP_ID || ''
const ALGOLIA_SEARCH_KEY = process.env.ALGOLIA_SEARCH_KEY || ''
const ALGOLIA_INDEX_PREFIX = process.env.ALGOLIA_INDEX_PREFIX || ''

const searchClient = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_SEARCH_KEY)

export default function SearchRulesAndSimulators() {
	return (
		<InstantSearch
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
		</InstantSearch>
	)
}

const SearchBox = connectSearchBox(
	({ currentRefinement, isSearchStalled, refine }) => {
		const { t } = useTranslation()
		return (
			<form noValidate action="" role="search">
				<SearchField
					label="Votre recherche"
					type="search"
					autoFocus
					value={currentRefinement}
					onChange={refine}
					onClear={() => refine('')}
					placeholder={t(
						'recherche-globale.placeholder',
						'Mot-clé ou acronyme (ex : CSG)'
					)}
				/>
				{isSearchStalled ? 'My search is stalled' : ''}
			</form>
		)
	}
)
