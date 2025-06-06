import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Configure, Index } from 'react-instantsearch-dom'
import { useLocation } from 'react-router-dom'
import { styled } from 'styled-components'

import { Spacing } from '@/design-system'

import { algoliaIndexPrefix, searchClient } from './Algolia'
import { RulesInfiniteHits } from './RulesInfiniteHits'
import { SearchBox } from './SearchBox'
import { SearchRoot } from './SearchRoot'
import { SimulatorHits } from './SimulatorHits'

interface Props {
	closePopover: () => void
}

export default function SearchRulesAndSimulators({ closePopover }: Props) {
	const { t } = useTranslation()
	const location = useLocation()
	const prevLocation = useRef(location)
	useEffect(() => {
		if (prevLocation.current !== location) {
			prevLocation.current = location
			closePopover()
		}
	}, [closePopover, location])

	return (
		<StyledContainer>
			<SearchRoot
				indexName={`${algoliaIndexPrefix}rules`}
				searchClient={searchClient}
				role="search"
			>
				<SearchBox
					label={t('Rechercher un simulateur ou une règle')}
					aria-label={t('Rechercher un simulateur ou une règle')}
				/>

				<Index indexName={`${algoliaIndexPrefix}simulateurs`}>
					<Configure hitsPerPage={6} />
					<SimulatorHits />
				</Index>

				<Index indexName={`${algoliaIndexPrefix}rules`}>
					<RulesInfiniteHits />
				</Index>
				<Spacing lg />
			</SearchRoot>
		</StyledContainer>
	)
}

const StyledContainer = styled.div`
	min-height: 400px;
`
