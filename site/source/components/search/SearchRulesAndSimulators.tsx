import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Configure, Index } from 'react-instantsearch-dom'
import { styled } from 'styled-components'

import { Spacing } from '@/design-system'
import { useNavigation } from '@/lib/navigation'

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
	const { onNavigate } = useNavigation()

	useEffect(() => {
		return onNavigate(closePopover)
	}, [closePopover, onNavigate])

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
