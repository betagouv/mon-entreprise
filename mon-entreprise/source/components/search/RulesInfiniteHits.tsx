import { Trans, useTranslation } from 'react-i18next'
import {
	connectInfiniteHits,
	connectStats,
	Highlight,
} from 'react-instantsearch-dom'
import { Names } from '../../../../modele-social/dist/names'

import RuleLink from '../RuleLink'
import { Hit as AlgoliaHit } from 'react-instantsearch-core'

type Hit = AlgoliaHit<{ objectID: Names; namespace?: string }>

const Hit = (hit: Hit) => {
	return (
		<RuleLink dottedName={hit.objectID} className="hit-content">
			{hit.namespace && (
				<div className="hit-amespace ui__ notice">
					<Highlight hit={hit} attribute="namespace" separator=" > " />
				</div>
			)}
			<div className="hit-ruleName">
				<Highlight hit={hit} attribute="ruleName" />
			</div>
		</RuleLink>
	)
}

const HideableTitle = connectStats(({ nbHits }) => {
	return nbHits === 0 ? (
		<></>
	) : (
		<h2>
			<Trans>Règles de calculs</Trans>
		</h2>
	)
})

const Hits = connectInfiniteHits(({ hits, hasMore, refineNext }) => {
	const { t } = useTranslation()
	return (
		<div className="hit-container">
			<div className="ais-InfiniteHits">
				<>
					<ol className="ais-InfiniteHits-list">
						{hits.map((hit) => (
							<li className="ais-InfiniteHits-item" key={hit.objectID}>
								<Hit {...hit} />
							</li>
						))}
					</ol>
					{hasMore && (
						<button className="ais-InfiniteHits-loadMore" onClick={refineNext}>
							{t('Charger plus de résultats')}
						</button>
					)}
				</>
			</div>
		</div>
	)
})

export const RulesInfiniteHits = () => {
	return (
		<>
			<HideableTitle />
			<Hits />
		</>
	)
}
