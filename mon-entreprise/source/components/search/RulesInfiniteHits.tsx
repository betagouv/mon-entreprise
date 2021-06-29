import { useTranslation } from 'react-i18next'
import { Highlight, InfiniteHits } from 'react-instantsearch-dom'
import { Names } from '../../../../modele-social/dist/names'
import RuleLink from '../RuleLink'

const Hit = ({ hit }: { hit: { path: Array<string>; objectID: Names } }) => {
	const { t } = useTranslation()
	return (
		<div className="hit-content">
			<Highlight hit={hit} attribute="path" separator=" > " />
			<RuleLink dottedName={hit.objectID}>{t('Voir la règle')}</RuleLink>
		</div>
	)
}

export const RulesInfiniteHits = () => {
	const { t } = useTranslation()
	return (
		<div className="hit-container">
			<InfiniteHits
				hitComponent={Hit}
				translations={{
					loadMore: t('Charger plus de résultats'),
				}}
			/>
		</div>
	)
}
