import { DottedName } from 'modele-social'
import { useTranslation } from 'react-i18next'
import { Hit as AlgoliaHit } from 'react-instantsearch-core'
import { connectInfiniteHits } from 'react-instantsearch-dom'
import { styled } from 'styled-components'

import { Button } from '@/design-system/buttons'
import { Body, SmallBody } from '@/design-system/typography/paragraphs'

import RuleLink from '../../RuleLink'
import { Highlight } from '../Hightlight'

type THit = AlgoliaHit<{ objectID: DottedName; namespace?: string }>

const StyledRuleLink = styled(RuleLink)`
	display: block; // Fix focus outline on chrome

	${SmallBody}, ${Body} {
		margin: 0;
		color: inherit;
		background-color: inherit;
		display: block;
	}

	${Body} {
		font-weight: 600;
		color: inherit;
		background-color: inherit;
	}
`

const HitContainer = styled.li`
	display: block;

	border-top: 1px solid #eee;
	padding-top: 0.5rem;
	padding-bottom: 0.5rem;
	border-radius: 0.1rem;

	&:first-child {
		border-top: transparent;
		padding-top: 0;
	}
`

const Hit = (hit: THit) => {
	return (
		<HitContainer>
			<StyledRuleLink dottedName={hit.objectID}>
				{hit.namespace && (
					<SmallBody as="span" className="hit-namespace">
						<Highlight hit={hit} attribute="namespace" separator=" > " />
					</SmallBody>
				)}
				<Body as="span" className="hit-ruleName">
					<Highlight hit={hit} attribute="ruleName" />
				</Body>
			</StyledRuleLink>
		</HitContainer>
	)
}

const HitList = styled.ol`
	display: flex;
	flex-direction: column;
	margin: 0;
	list-style-type: none;
	padding: 0;
	width: 100%;
`

const InfiniteHits = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;

	& > button {
		margin: auto;
		margin-top: 1rem;
	}
`

interface IHits {
	hits: THit[]
	hasMore: boolean
	hasPrevious: boolean
	refineNext: () => void
}

const Hits = connectInfiniteHits(({ hits, hasMore, refineNext }: IHits) => {
	const { t } = useTranslation()

	return (
		<InfiniteHits>
			<HitList>
				{hits.map((hit) => (
					<Hit {...hit} key={hit.objectID} />
				))}
			</HitList>
			{hasMore && (
				<Button light size="XS" onPress={refineNext}>
					{t('Charger plus de résultats')}
				</Button>
			)}
		</InfiniteHits>
	)
})

export const RulesInfiniteHits = () => {
	return (
		<>
			<Hits />
		</>
	)
}
