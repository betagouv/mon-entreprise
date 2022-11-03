import { DottedName } from 'modele-social'
import { Trans, useTranslation } from 'react-i18next'
import { Hit as AlgoliaHit } from 'react-instantsearch-core'
import { connectInfiniteHits, connectStats } from 'react-instantsearch-dom'
import styled from 'styled-components'

import { Button } from '@/design-system/buttons'
import { FocusStyle } from '@/design-system/global-style'
import { H3 } from '@/design-system/typography/heading'
import { Body, SmallBody } from '@/design-system/typography/paragraphs'

import RuleLink from '../../RuleLink'
import { Highlight } from '../Hightlight'

type THit = AlgoliaHit<{ objectID: DottedName; namespace?: string }>

const StyledRuleLink = styled(RuleLink)`
	${SmallBody}, ${Body} {
		margin: 0;
		color: inherit;
	}

	${Body} {
		font-weight: 600;
		color: inherit;
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

	&:focus-within {
		${FocusStyle}
	}
`

const Hit = (hit: THit) => {
	return (
		<HitContainer>
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
		</HitContainer>
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

const HitList = styled.ol`
	display: flex;
	flex-direction: column;

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
				<Button light size="XS" onClick={refineNext}>
					{t('Charger plus de résultats')}
				</Button>
			)}
		</InfiniteHits>
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
