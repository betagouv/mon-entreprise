import { H3 } from 'DesignSystem/typography/heading'
import { Body, SmallBody } from 'DesignSystem/typography/paragraphs'
import { Trans, useTranslation } from 'react-i18next'
import { Hit as AlgoliaHit } from 'react-instantsearch-core'
import {
	connectInfiniteHits,
	connectStats,
	Highlight,
} from 'react-instantsearch-dom'
import styled from 'styled-components'
import { Names } from '../../../../modele-social/dist/names'
import RuleLink from '../RuleLink'

type Hit = AlgoliaHit<{ objectID: Names; namespace?: string }>

const StyledRuleLink = styled(RuleLink)`
	${SmallBody}, ${Body} {
		margin: 0;
	}

	${Body} {
		font-weight: 600;
	}
`

const Hit = (hit: Hit) => {
	return (
		<StyledRuleLink dottedName={hit.objectID}>
			{hit.namespace && (
				<SmallBody className="hit-namespace">
					<Highlight hit={hit} attribute="namespace" separator=" > " />
				</SmallBody>
			)}
			<Body className="hit-ruleName">
				<Highlight hit={hit} attribute="ruleName" />
			</Body>
		</StyledRuleLink>
	)
}

const HideableTitle = connectStats(({ nbHits }) => {
	return nbHits === 0 ? (
		<></>
	) : (
		<H3 as="h2">
			<Trans>Règles de calculs</Trans>
		</H3>
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
