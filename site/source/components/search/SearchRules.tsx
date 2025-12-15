import { Trans, useTranslation } from 'react-i18next'

import { H2 } from '@/design-system'

import { algoliaIndexPrefix, searchClient } from './Algolia'
import { RulesInfiniteHits } from './RulesInfiniteHits'
import { SearchBox } from './SearchBox'
import { SearchRoot } from './SearchRoot'

export default function SearchRules() {
	const { t } = useTranslation()

	return (
		<SearchRoot
			indexName={`${algoliaIndexPrefix}rules`}
			searchClient={searchClient}
		>
			<SearchBox label={t('Rechercher une règle dans la documentation')} />
			<H2>
				<Trans>Règles de calculs</Trans>
			</H2>
			<RulesInfiniteHits />
		</SearchRoot>
	)
}
