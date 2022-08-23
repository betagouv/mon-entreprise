import Emoji from '@/components/utils/Emoji'
import { SmallCard } from '@/design-system/card'
import InfoBulle from '@/design-system/InfoBulle'
import { Grid } from '@/design-system/layout'
import { H3 } from '@/design-system/typography/heading'
import { ExtractFromSimuData } from '@/pages/Simulateurs/metadata'
import { MetadataSrc } from '@/pages/Simulateurs/metadata-src'
import { useSitePaths } from '@/sitePaths'
import { Trans } from 'react-i18next'
import { Hit } from 'react-instantsearch-core'
import { connectHits } from 'react-instantsearch-dom'
import { Highlight } from './Hightlight'

type AlgoliaSimulatorHit = Hit<{
	icône: string
	title: string
	pathId: MetadataSrc[keyof MetadataSrc]['pathId']
}>

type SimulatorHitsProps = {
	hits: Array<AlgoliaSimulatorHit>
}

const SimulateurCardHit = ({
	hit,
	path,
	tooltip,
}: {
	path: ExtractFromSimuData<'path'>
	tooltip?: ExtractFromSimuData<'tooltip'>
	hit: AlgoliaSimulatorHit
}) => {
	return (
		<SmallCard
			icon={<Emoji emoji={hit.icône} />}
			to={{ pathname: path }}
			state={{ fromSimulateurs: true }}
			title={
				<h4>
					<Highlight hit={hit} attribute="title" />{' '}
					{tooltip && <InfoBulle>{tooltip}</InfoBulle>}
				</h4>
			}
		/>
	)
}

export const SimulatorHits = connectHits<
	{ hits: AlgoliaSimulatorHit[] },
	AlgoliaSimulatorHit
>(({ hits }: SimulatorHitsProps) => {
	const { absoluteSitePaths } = useSitePaths()

	return (
		<>
			{hits.length > 0 && (
				<H3 as="h2">
					<Trans>Simulateurs</Trans>
				</H3>
			)}
			<Grid container spacing={2}>
				{hits.map(
					(hit) =>
						hit.pathId && (
							<Grid item key={hit.objectID} xs={12} lg={6}>
								<SimulateurCardHit
									hit={hit}
									path={
										hit.pathId
											.split('.')
											.reduce<unknown>(
												(acc, curr) => (acc as Record<string, unknown>)[curr],
												absoluteSitePaths
											) as ExtractFromSimuData<'path'>
									}
								/>
							</Grid>
						)
				)}
			</Grid>
		</>
	)
})
