import { Trans, useTranslation } from 'react-i18next'

import { H2 } from '@/design-system/typography/heading'

import { RulesInfiniteHits } from './RulesInfiniteHits'
import { SearchBox } from './SearchBox'
import searchClient from './SearchClient'
import { SearchRoot } from './SearchRoot'

const ALGOLIA_INDEX_PREFIX = import.meta.env.VITE_ALGOLIA_INDEX_PREFIX || ''

export default function SearchRules() {
	const { t } = useTranslation()

	return (
		<SearchRoot
			indexName={`${ALGOLIA_INDEX_PREFIX}rules`}
			searchClient={searchClient}
		>
			<SearchBox
				label={t('Rechercher une règle dans la documentation')}
				aria-label={t('Rechercher une règle dans la documentation')}
			/>
			<H2>
				<Trans>Règles de calculs</Trans>
			</H2>
			<RulesInfiniteHits />
		</SearchRoot>
	)
}
