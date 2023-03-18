import algoliasearch from 'algoliasearch/lite'
import { useEffect, useRef } from 'react'
import { Trans } from 'react-i18next'
import { Configure, Index } from 'react-instantsearch-dom'
import { useLocation } from 'react-router-dom'

import { Spacing } from '@/design-system/layout'
import { H2, H3 } from '@/design-system/typography/heading'

import { RulesInfiniteHits } from './RulesInfiniteHits'
import { SearchBox } from './SearchBox'
import { SearchRoot } from './SearchRoot'
import { SimulatorHits } from './SimulatorHits'

const ALGOLIA_APP_ID = import.meta.env.VITE_ALGOLIA_APP_ID || ''
const ALGOLIA_SEARCH_KEY = import.meta.env.VITE_ALGOLIA_SEARCH_KEY || ''
const ALGOLIA_INDEX_PREFIX = import.meta.env.VITE_ALGOLIA_INDEX_PREFIX || ''

const searchClient = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_SEARCH_KEY)

interface Props {
	closePopover: () => void
}

export default function SearchRulesAndSimulators({
	closePopover,
	...searchProps
}: Props) {
	const location = useLocation()
	const prevLocation = useRef(location)
	useEffect(() => {
		if (prevLocation.current !== location) {
			prevLocation.current = location
			closePopover()
		}
	}, [closePopover, location])

	return (
		<SearchRoot
			indexName={`${ALGOLIA_INDEX_PREFIX}rules`}
			searchClient={searchClient}
			role="search"
		>
			<SearchBox {...searchProps} />

			<Index indexName={`${ALGOLIA_INDEX_PREFIX}simulateurs`}>
				<Configure hitsPerPage={6} />
				<SimulatorHits />
			</Index>

			<Index indexName={`${ALGOLIA_INDEX_PREFIX}rules`}>
				<H2 as={H3}>
					<Trans>Règles de calculs</Trans>
				</H2>
				<RulesInfiniteHits />
			</Index>
			<Spacing lg />
		</SearchRoot>
	)
}
