import { Trans } from 'react-i18next'
import { Hit } from 'react-instantsearch-core'
import { connectHits } from 'react-instantsearch-dom'
import styled from 'styled-components'

import InfoBulle from '@/design-system/InfoBulle'
import { SmallCard } from '@/design-system/card'
import { Emoji } from '@/design-system/emoji'
import { Grid } from '@/design-system/layout'
import { H3 } from '@/design-system/typography/heading'
import { MergedSimulatorDataValues } from '@/hooks/useCurrentSimulatorData'
import { useSitePaths } from '@/sitePaths'

import { Highlight } from './Hightlight'

type AlgoliaSimulatorHit = Hit<{
	icône: string
	title: string
	pathId: MergedSimulatorDataValues['pathId']
}>

type SimulatorHitsProps = {
	hits: Array<AlgoliaSimulatorHit>
}

const SimulateurCardHit = ({
	hit,
	path,
	tooltip,
}: {
	path: MergedSimulatorDataValues['path'] | '/'
	tooltip?: MergedSimulatorDataValues['tooltip']
	hit: AlgoliaSimulatorHit
}) => {
	return (
		<StyledSmallCard
			icon={<Emoji emoji={hit.icône} />}
			to={{ pathname: path }}
			state={{ fromSimulateurs: true }}
			title={
				<p>
					<Highlight hit={hit} attribute="title" />{' '}
					{tooltip && <InfoBulle>{tooltip}</InfoBulle>}
				</p>
			}
		/>
	)
}

const StyledSmallCard = styled(SmallCard)`
	border: solid 1px ${({ theme }) => theme.colors.bases.primary[800]};
`

export const SimulatorHits = connectHits<
	{ hits: AlgoliaSimulatorHit[] },
	AlgoliaSimulatorHit
>(({ hits }: SimulatorHitsProps) => {
	const { absoluteSitePaths } = useSitePaths()

	const getPath = (hit: AlgoliaSimulatorHit) =>
		hit.pathId
			.split('.')
			.reduce<Record<string, unknown> | null>(
				(acc, curr) =>
					(acc && curr in acc && (acc[curr] as Record<string, unknown>)) ||
					null,
				absoluteSitePaths
			) as MergedSimulatorDataValues['path'] | null

	return (
		<>
			{hits.length > 0 && (
				<H3 as="h2">
					<Trans>Simulateurs</Trans>
				</H3>
			)}
			<Grid container spacing={2} as="ul" style={{ padding: 0 }}>
				{hits.map(
					(hit) =>
						hit.pathId && (
							<Grid
								item
								key={hit.objectID}
								xs={12}
								lg={6}
								as="li"
								style={{ listStyle: 'none' }}
							>
								<SimulateurCardHit hit={hit} path={getPath(hit) ?? '/'} />
							</Grid>
						)
				)}
			</Grid>
		</>
	)
})
