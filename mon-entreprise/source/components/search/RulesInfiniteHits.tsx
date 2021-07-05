import { useTranslation } from 'react-i18next'
import { Highlight, InfiniteHits } from 'react-instantsearch-dom'
import { Names } from '../../../../modele-social/dist/names'
import RuleLink from '../RuleLink'

const Hit = ({ hit }: { hit: { path: Array<string>; objectID: Names } }) => {
	const { t } = useTranslation()
	return (
		<RuleLink dottedName={hit.objectID} className="hit-content">
			{hit.namespace && (
				<div className="hit-namespace">
					<Highlight hit={hit} attribute="namespace" separator=" > " />
				</div>
			)}
			<div className="hit-ruleName">
				<Highlight hit={hit} attribute="ruleName" />
			</div>
		</RuleLink>
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
