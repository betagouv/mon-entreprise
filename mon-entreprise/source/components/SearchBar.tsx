import 'instantsearch.css/themes/satellite.css'
import './SearchBar.css'

import RuleLink from './RuleLink'
import algoliasearch from 'algoliasearch/lite'
import {
	InstantSearch,
	SearchBox,
	Hits,
	Highlight,
} from 'react-instantsearch-dom'
import { Names } from '../../../modele-social/dist/names'

type SearchBarProps = {}

const ALGOLIA_APP_ID = process.env.ALGOLIA_APP_ID || 'QYX2LLVOAD'
const ALGOLIA_SEARCH_KEY =
	process.env.ALGOLIA_SEARCH_KEY || '9c77be10ac3d3f5217e0a417c859fc90'
const searchClient = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_SEARCH_KEY)

const Hit = ({ hit }: { hit: { path: Array<String>; objectID: Names } }) => (
	<div className="hit-content">
		<Highlight hit={hit} attribute="path" separator=" > " />
		<RuleLink dottedName={hit.objectID}>Voir</RuleLink>
	</div>
)

export default function SearchBar({}: SearchBarProps) {
	return (
		<InstantSearch indexName="rules" searchClient={searchClient}>
			<SearchBox />
			<div className="hit-container">
				<Hits hitComponent={Hit} />
			</div>
		</InstantSearch>
	)
}
