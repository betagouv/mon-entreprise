import { Trans, useTranslation } from 'react-i18next'
import { Hit as AlgoliaHit } from 'react-instantsearch-core'
import { connectInfiniteHits } from 'react-instantsearch-dom'
import { styled } from 'styled-components'

import { FromTop } from '@/components/ui/animate'
import { Body, Button, H3, SmallBody } from '@/design-system'
import { DottedName } from '@/domaine/publicodes/DottedName'

import RuleLink from '../../RuleLink'
import { NomModèle } from '@/domaine/SimulationConfig'
import { EngineProvider } from '@/utils/publicodes/EngineContext'
import { useEngineFromModèle } from '@/hooks/useEngineFromModèle'

type THit = AlgoliaHit<{
	dottedName: DottedName
	nomModèle: NomModèle
	namespace?: string
	ruleName?: string
}>

const StyledRuleLink = styled(RuleLink)`
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
	display: flex;
	flex-direction: column;
	align-items: flex-start;

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
	const engine = useEngineFromModèle(hit.nomModèle)

	return (
		<HitContainer>
			{hit.namespace && (
				<SmallBody as="span" className="hit-namespace">
					{Object.values(hit.namespace).join(' > ')}
				</SmallBody>
			)}

			<EngineProvider value={engine}>
				<StyledRuleLink dottedName={hit.dottedName} aria-label={hit.ruleName}>
					<Body as="span" className="hit-ruleName">
						{hit.ruleName}
					</Body>
				</StyledRuleLink>
			</EngineProvider>
		</HitContainer>
	)
}

const HitList = styled.ul`
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
	if (!hits.length) {
		return (
			<FromTop>
				<SmallBody $grey>
					<Trans>
						Aucun résultat ne correspond à votre recherche. Essayez avec
						d'autres mots-clés.
					</Trans>
				</SmallBody>
			</FromTop>
		)
	}

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
			<H3 as="h2">
				<Trans>Documentation des simulateurs</Trans>
			</H3>
			<Hits />
		</>
	)
}
