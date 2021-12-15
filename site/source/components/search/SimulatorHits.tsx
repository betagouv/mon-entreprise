import { Grid } from '@mui/material'
import Emoji from 'Components/utils/Emoji'
import { SitePathsContext } from 'Components/utils/SitePathsContext'
import { SmallCard } from 'DesignSystem/card'
import InfoBulle from 'DesignSystem/InfoBulle'
import { H3 } from 'DesignSystem/typography/heading'
import { SimulatorData } from 'pages/Simulateurs/metadata'
import { path } from 'ramda'
import { useContext } from 'react'
import { Trans } from 'react-i18next'
import { connectHits } from 'react-instantsearch-dom'
import { Highlight } from './Hightlight'

type AlgoliaSimulatorHit = {
	objectID: string
	icône: string
	title: string
	pathId: string
}

type SimulatorHitsProps = {
	hits: Array<AlgoliaSimulatorHit>
}

const SimulateurCardHit = ({
	hit,
	path,
	tooltip,
}: Pick<SimulatorData[keyof SimulatorData], 'path' | 'tooltip'> & {
	hit: AlgoliaSimulatorHit
}) => {
	return (
		<SmallCard
			icon={<Emoji emoji={hit.icône} />}
			to={{
				state: { fromSimulateurs: true },
				pathname: path,
			}}
			title={
				<h4>
					<Highlight hit={hit} attribute="title" />{' '}
					{tooltip && <InfoBulle>{tooltip}</InfoBulle>}
				</h4>
			}
		/>
	)
}

export const SimulatorHits = connectHits(({ hits }: SimulatorHitsProps) => {
	const sitePaths = useContext(SitePathsContext)
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
									path={path(hit.pathId.split('.'), sitePaths)}
								/>
							</Grid>
						)
				)}
			</Grid>
		</>
	)
})
